"""
Challenges Service — Orchestrates tracking, completion, and reward claiming.
"""
from typing import Dict, Any, Optional, List
from sqlalchemy import select, update, and_
from sqlalchemy.ext.asyncio import AsyncSession
from src.challenges.models import Challenge, UserChallenge
from src.users.models import User
from src.challenges.tracker import ChallengeTracker
from src.challenges import xp_service

async def get_user_xp_info(db: AsyncSession, user_id: int) -> dict:
    """Get current user's XP, level and progress towards next level."""
    res = await db.execute(select(User).where(User.id == user_id))
    user = res.scalar_one()
    
    return {
        "current_xp": user.xp,
        "level": user.level,
        "next_level_xp": user.next_level_xp,
        "total_xp_earned": user.total_xp_earned,
        "progress_percentage": min(int((user.xp / user.next_level_xp) * 100), 100) if user.next_level_xp > 0 else 0
    }

async def join_challenge(db: AsyncSession, user_id: int, challenge_id: int) -> dict:
    """Enroll a user in a challenge if not already enrolled."""
    # Check if challenge exists
    res = await db.execute(select(Challenge).where(Challenge.id == challenge_id))
    challenge = res.scalar_one_or_none()
    
    if not challenge:
        return {"success": False, "error": "Challenge not found"}
        
    # Check if already joined
    res = await db.execute(
        select(UserChallenge).where(
            and_(
                UserChallenge.user_id == user_id,
                UserChallenge.challenge_id == challenge_id
            )
        )
    )
    user_challenge = res.scalar_one_or_none()
    
    if user_challenge:
        return {"success": True, "message": "Already joined", "user_challenge_id": user_challenge.id}
        
    # Create new entry
    user_challenge = UserChallenge(
        user_id=user_id,
        challenge_id=challenge_id,
        progress=0,
        status="active"
    )
    db.add(user_challenge)
    await db.commit()
    await db.refresh(user_challenge)
    
    return {
        "success": True, 
        "message": "Joined successfully", 
        "user_challenge_id": user_challenge.id
    }

async def track_user_action(
    db: AsyncSession,
    user_id: int,
    action_type: str,
    ref_type: Optional[str] = None,
    ref_id: Optional[int] = None,
    metadata: Dict[str, Any] = None
):
    """
    Track a user action and update relevant challenges.
    This is the main entry point for other services.
    """
    await ChallengeTracker.track_action(
        db=db,
        user_id=user_id,
        action_type=action_type,
        ref_type=ref_type,
        ref_id=ref_id,
        metadata=metadata
    )
    # Note: ChallengeTracker marks as 'completed'. User usually claims reward manually
    # or it can be auto-claimed for some types.

async def claim_challenge_reward(
    db: AsyncSession,
    user_id: int,
    user_challenge_id: int
) -> dict:
    """
    Claim rewards for a completed challenge.
    Checks status, updates status to 'claimed', and awards XP.
    """
    query = (
        select(UserChallenge, Challenge)
        .join(Challenge, UserChallenge.challenge_id == Challenge.id)
        .where(
            and_(
                UserChallenge.id == user_challenge_id,
                UserChallenge.user_id == user_id
            )
        )
    )
    result = await db.execute(query)
    row = result.fetchone()
    
    if not row:
        return {"success": False, "error": "Challenge not found"}
        
    user_challenge, challenge = row
    
    if user_challenge.status != "completed":
        return {"success": False, "error": f"Challenge status is {user_challenge.status}, not completed"}

    # Update status ATOMICALLY to claim
    # This prevents double claiming
    stmt = (
        update(UserChallenge)
        .where(UserChallenge.id == user_challenge_id, UserChallenge.status == "completed")
        .values(
            status="claimed",
            claimed_at=func.now()
        )
        .returning(UserChallenge.id)
    )
    
    # We need func from sqlalchemy
    from sqlalchemy import func
    res = await db.execute(stmt)
    if not res.scalar():
        return {"success": False, "error": "Already claimed or status changed"}

    # Award XP
    xp_res = await xp_service.award_xp(
        db=db,
        user_id=user_id,
        amount=challenge.xp_reward,
        source_type="challenge",
        source_id=challenge.id,
        description=f"Completed challenge: {challenge.title}"
    )
    
    return {
        "success": True,
        "challenge_title": challenge.title,
        "xp_awarded": challenge.xp_reward,
        "new_level": xp_res["new_level"],
        "leveled_up": xp_res["leveled_up"]
    }

async def get_user_challenges(
    db: AsyncSession,
    user_id: int,
    status: Optional[str] = None
) -> List[dict]:
    """Get all challenges for a user with their current progress."""
    query = (
        select(UserChallenge, Challenge)
        .join(Challenge, UserChallenge.challenge_id == Challenge.id)
        .where(UserChallenge.user_id == user_id)
    )
    
    if status:
        query = query.where(UserChallenge.status == status)
        
    result = await db.execute(query)
    rows = result.all()
    
    output = []
    for uc, c in rows:
        output.append({
            "id": str(uc.id),
            "challenge": {
                "id": str(c.id),
                "title": c.title,
                "description": c.description,
                "category": c.category,
                "difficulty": c.difficulty,
                "xp_reward": c.xp_reward,
                "target_count": c.target_count,
                "icon": c.icon,
                "accent_color": c.accent_color
            },
            "progress": uc.progress,
            "target": c.target_count,
            "status": uc.status,
            "percentage": min(int((uc.progress / c.target_count) * 100), 100) if c.target_count > 0 else 0,
            "completed_at": uc.completed_at.isoformat() if uc.completed_at else None,
            "claimed_at": uc.claimed_at.isoformat() if uc.claimed_at else None,
            "expires_at": uc.expires_at.isoformat() if uc.expires_at else None
        })
    return output
