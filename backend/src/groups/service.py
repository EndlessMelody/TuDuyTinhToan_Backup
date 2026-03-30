"""
Groups Service — Lobby management + Minimax Group Referee.

Minimax formula: min(max_i∈Group |Score_i - Score_ideal|)
Implementation:
  1. Collect each member's preference vector (food or place)
  2. Average vectors with compromise_score boost for members who were "sacrificed" last round
  3. Score all candidate locations for each member
  4. Pick the location that minimizes the maximum dissatisfaction
  5. Update compromise_score for the most-sacrificed member going forward
"""
import asyncio
import numpy as np
from numpy.typing import NDArray
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Optional, List, Dict, Any

from src.groups.models import Group, GroupMember
from src.users.models import User
from src.groups.schemas import GroupCreate, GroupResponse, MemberSummary, GroupRecommendRequest, GroupRecommendResponse, GroupPlaceResult, MemberScore, GroupListResponse


async def create_group(db: AsyncSession, data: GroupCreate, creator_id: int) -> Group:
    group = Group(**data.model_dump())
    db.add(group)
    await db.flush()
    # Auto-join creator
    member = GroupMember(group_id=group.id, user_id=creator_id)
    db.add(member)
    try:
        await db.commit()
        await db.refresh(group)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return group


async def list_groups(db: AsyncSession, status: str = "active", limit: int = 10) -> List[dict]:
    result = await db.execute(
        select(Group).where(Group.status == status).order_by(Group.created_at.desc()).limit(limit)
    )
    groups = result.scalars().all()
    return [await _group_to_dict(db, g) for g in groups]


async def get_group(db: AsyncSession, group_id: int) -> dict:
    result = await db.execute(select(Group).where(Group.id == group_id))
    group = result.scalars().first()
    if not group:
        raise HTTPException(status_code=404, detail="Lobby không tìm thấy")
    return await _group_to_dict(db, group)


async def join_group(db: AsyncSession, group_id: int, user_id: int) -> dict:
    group_q = await db.execute(select(Group).where(Group.id == group_id))
    group = group_q.scalars().first()
    if not group:
        raise HTTPException(status_code=404, detail="Lobby không tồn tại")

    members_q = await db.execute(select(GroupMember).where(GroupMember.group_id == group_id))
    members = members_q.scalars().all()

    if len(members) >= group.max_spots:
        raise HTTPException(status_code=400, detail="Lobby đã đầy")

    existing = next((m for m in members if m.user_id == user_id), None)
    if existing:
        raise HTTPException(status_code=400, detail="Đã tham gia lobby rồi")

    new_member = GroupMember(group_id=group_id, user_id=user_id)
    db.add(new_member)
    await db.commit()
    return {"status": "joined"}


async def leave_group(db: AsyncSession, group_id: int, user_id: int) -> dict:
    result = await db.execute(
        select(GroupMember).where(GroupMember.group_id == group_id, GroupMember.user_id == user_id)
    )
    member = result.scalars().first()
    if not member:
        raise HTTPException(status_code=404, detail="Bạn không phải thành viên lobby này")
    await db.delete(member)
    await db.commit()
    return {"status": "left"}


async def set_ready(db: AsyncSession, group_id: int, user_id: int, is_ready: bool) -> dict:
    result = await db.execute(
        select(GroupMember).where(GroupMember.group_id == group_id, GroupMember.user_id == user_id)
    )
    member = result.scalars().first()
    if not member:
        raise HTTPException(status_code=404, detail="Bạn không phải thành viên lobby này")
    member.is_ready = is_ready
    await db.commit()
    return {"is_ready": is_ready}


async def group_recommend(db: AsyncSession, group_id: int, body: GroupRecommendRequest) -> dict:
    """
    Minimax Referee.
    Groups vectors with weighting based on compromise_score (loser boost).
    """
    # Get members + their vectors
    members_q = await db.execute(
        select(GroupMember, User)
        .join(User, User.id == GroupMember.user_id)
        .where(GroupMember.group_id == group_id)
    )
    rows = members_q.all()
    if not rows:
        raise HTTPException(status_code=400, detail="Lobby trống")

    member_data = []
    for gm, user in rows:
        vec = user.food_vector if body.category == "food" else user.place_vector
        member_data.append({
            "user_id": user.id,
            "display_name": user.display_name or user.username,
            "vector": np.array(vec if vec is not None else [0.5] * 15, dtype=float),
            "compromise_score": gm.compromise_score or 0.0,
        })

    # Boost weights for members who were "sacrificed" most
    weights = np.array([1.0 + m["compromise_score"] for m in member_data])
    weights = weights / weights.sum()  # normalize

    group_vector = sum(w * m["vector"] for w, m in zip(weights, member_data))

    # Candidate locations
    from src.locations.models import Location
    from src.recommendations.service import _cosine_sim
    locs_q = await db.execute(
        select(Location).where(Location.category == body.category).limit(100)
    )
    locations = locs_q.scalars().all()

    results = []
    for loc in locations:
        if loc.vector is None:
            continue
        P = np.array(loc.vector, dtype=float)
        group_score = float(_cosine_sim(group_vector, P))
        member_scores = [
            {"user_id": m["user_id"], "display_name": m["display_name"],
             "score": float(_cosine_sim(m["vector"], P)),
             "compromise": 0.0}
            for m in member_data
        ]
        # Compute compromise for each member
        ideal = max(s["score"] for s in member_scores)
        for s in member_scores:
            s["compromise"] = round(ideal - s["score"], 3)
        most_compromised = max(member_scores, key=lambda x: x["compromise"])
        results.append({
            "place_id": loc.id, "name": loc.name, "group_score": round(group_score, 3),
            "member_scores": member_scores,
            "most_compromised_member": most_compromised["display_name"],
            "compensation_note": f"{most_compromised['display_name']} sẽ được ưu tiên ở lượt sau",
        })

    results.sort(key=lambda x: x["group_score"], reverse=True)
    # Minimax: minimize max dissatisfaction
    results.sort(key=lambda x: max(s["compromise"] for s in x["member_scores"]))

    return {
        "group_vector": group_vector.tolist(),
        "recommendations": results[:body.top_n],
    }


async def _group_to_dict(db: AsyncSession, group: Group) -> dict:
    members_q = await db.execute(
        select(GroupMember, User)
        .join(User, User.id == GroupMember.user_id)
        .where(GroupMember.group_id == group.id)
    )
    rows = members_q.all()
    members = [
        {"user_id": r[1].id, "display_name": r[1].display_name, "avatar_url": r[1].avatar_url, "is_ready": r[0].is_ready}
        for r in rows
    ]
    return {
        "id": group.id, "name": group.name, "status": group.status,
        "route_description": group.route_description,
        "scheduled_time": group.scheduled_time, "max_spots": group.max_spots,
        "cover_image_url": group.cover_image_url, "accent_color": group.accent_color,
        "created_at": group.created_at,
        "members": members,
        "spots_remaining": max(0, group.max_spots - len(members)),
    }
