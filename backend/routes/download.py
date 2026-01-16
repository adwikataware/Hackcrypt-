from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import uuid
from services.media_downloader import download_video
from services.storage import save_video_metadata, get_video, list_videos
import os

router = APIRouter()

class DownloadRequest(BaseModel):
    url: str

@router.post("/download")
async def download_media(request: DownloadRequest):
    """
    Download video from URL (YouTube, Twitter, Instagram, TikTok)
    and store metadata in SQLite.
    """
    try:
        # Download the video
        result = download_video(request.url)
        
        if not result['success']:
            raise HTTPException(status_code=400, detail=result.get('error', 'Download failed'))
        
        # Generate ID for tracking
        video_id = str(uuid.uuid4())
        
        # Extract metadata
        metadata = result.get('metadata', {})
        platform = detect_platform(request.url)
        
        # Get file size
        file_path = result['video_path']
        file_size = os.path.getsize(file_path) if os.path.exists(file_path) else 0
        
        # Save to database
        save_video_metadata(
            video_id=video_id,
            url=request.url,
            platform=platform,
            file_path=file_path,
            title=metadata.get('title', 'Unknown'),
            duration=metadata.get('duration', 0),
            file_size=file_size
        )
        
        return {
            'success': True,
            'video_id': video_id,
            'file_path': file_path,
            'title': metadata.get('title'),
            'duration': metadata.get('duration'),
            'platform': platform
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/videos")
async def list_all_videos():
    """Get list of all downloaded videos."""
    try:
        videos = list_videos()
        return {'success': True, 'videos': videos}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/video/{video_id}")
async def get_video_info(video_id: str):
    """Get specific video metadata."""
    try:
        video = get_video(video_id)
        if not video:
            raise HTTPException(status_code=404, detail="Video not found")
        return {'success': True, 'video': video}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def detect_platform(url: str) -> str:
    """Detect platform from URL."""
    url_lower = url.lower()
    if 'youtube.com' in url_lower or 'youtu.be' in url_lower:
        return 'YouTube'
    elif 'twitter.com' in url_lower or 'x.com' in url_lower:
        return 'Twitter/X'
    elif 'instagram.com' in url_lower:
        return 'Instagram'
    elif 'tiktok.com' in url_lower:
        return 'TikTok'
    return 'Unknown'
