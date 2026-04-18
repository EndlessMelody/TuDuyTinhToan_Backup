"""
Media Service — File upload handler.
Saves files to Supabase Storage and returns the public URL.
"""
import os
import uuid
from fastapi import UploadFile, HTTPException
from supabase import create_client, Client

from src.core.config import settings

# Initialize Supabase Client
SUPABASE_URL = settings.SUPABASE_URL
SUPABASE_KEY = os.environ.get("SUPABASE_KEY") or settings.SUPABASE_ANON_KEY

# Only create client if URL and KEY are present
supabase: Client | None = None
if SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

BUCKET_NAME = "tastemap-media"

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/webm"}
MAX_IMAGE_SIZE_MB = 10
MAX_VIDEO_SIZE_MB = 100


async def upload_file(file: UploadFile, upload_type: str, base_url: str) -> dict:
    if not supabase:
        raise HTTPException(
            status_code=500, detail="Supabase client not initialized. Check configuration."
        )

    content_type = file.content_type or ""

    if upload_type in ("avatar", "cover", "post"):
        allowed = ALLOWED_IMAGE_TYPES
        max_mb = MAX_IMAGE_SIZE_MB
    elif upload_type == "reel":
        allowed = ALLOWED_VIDEO_TYPES
        max_mb = MAX_VIDEO_SIZE_MB
    else:
        raise HTTPException(
            status_code=400, detail="type phải là 'avatar', 'cover', 'post', hoặc 'reel'"
        )

    if content_type not in allowed:
        raise HTTPException(
            status_code=400, detail=f"File type '{content_type}' không được phép cho '{upload_type}'"
        )

    contents = await file.read()
    size_bytes = len(contents)

    if size_bytes > max_mb * 1024 * 1024:
        raise HTTPException(
            status_code=400, detail=f"File quá lớn. Tối đa {max_mb}MB cho '{upload_type}'"
        )

    ext = content_type.split("/")[-1]
    filename = f"{upload_type}_{uuid.uuid4().hex}.{ext}"
    
    # Path in bucket: e.g., reels/reel_123.mp4
    folder = "reels" if upload_type == "reel" else upload_type
    file_path = f"{folder}/{filename}"

    try:
        # Uploading to Supabase
        res = supabase.storage.from_(BUCKET_NAME).upload(
            file_path, 
            contents,
            file_options={"content-type": content_type}
        )
        
        # Get public url securely
        public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi upload lên Supabase: {str(e)}")

    return {"url": public_url, "file_type": content_type, "size_bytes": size_bytes}
