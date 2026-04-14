"""
Media Service — File upload handler.
Saves files to static/uploads/ and returns the public URL.
TODO: Replace with cloud storage (S3/Cloudinary/R2) by updating UPLOAD_DIR and returning the CDN URL.
"""
import os
import uuid
from fastapi import UploadFile, HTTPException

UPLOAD_DIR = "static/uploads"
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/webm"}
MAX_IMAGE_SIZE_MB = 10
MAX_VIDEO_SIZE_MB = 100


async def upload_file(file: UploadFile, upload_type: str, base_url: str) -> dict:
    content_type = file.content_type or ""

    if upload_type in ("avatar", "cover", "post"):
        allowed = ALLOWED_IMAGE_TYPES
        max_mb = MAX_IMAGE_SIZE_MB
    elif upload_type == "reel":
        allowed = ALLOWED_VIDEO_TYPES
        max_mb = MAX_VIDEO_SIZE_MB
    else:
        raise HTTPException(status_code=400, detail="type phải là 'avatar', 'cover', 'post', hoặc 'reel'")

    if content_type not in allowed:
        raise HTTPException(status_code=400, detail=f"File type '{content_type}' không được phép cho '{upload_type}'")

    contents = await file.read()
    size_bytes = len(contents)

    if size_bytes > max_mb * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File quá lớn. Tối đa {max_mb}MB cho '{upload_type}'")

    ext = content_type.split("/")[-1]
    filename = f"{upload_type}_{uuid.uuid4().hex}.{ext}"
    subdir = os.path.join(UPLOAD_DIR, upload_type)
    os.makedirs(subdir, exist_ok=True)
    filepath = os.path.join(subdir, filename)

    with open(filepath, "wb") as f:
        f.write(contents)

    public_url = f"{base_url}/static/uploads/{upload_type}/{filename}"
    return {"url": public_url, "file_type": content_type, "size_bytes": size_bytes}
