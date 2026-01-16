from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
import os
import uuid

router = APIRouter()

@router.post("/detect")
async def detect_deepfake(
    video: Optional[UploadFile] = File(None),
    video_url: Optional[str] = Form(None)
):
    """
    Detect deepfakes from uploaded video or URL.
    """
    
    # Validate input
    if not video and not video_url:
        raise HTTPException(
            status_code=400,
            detail="Either video file or video_url must be provided"
        )
    
    try:
        video_path = None
        
        # Handle file upload
        if video:
            # Save uploaded file
            video_id = str(uuid.uuid4())[:8]
            video_path = f"temp/videos/{video_id}_{video.filename}"
            
            with open(video_path, "wb") as f:
                content = await video.read()
                f.write(content)
            
            print(f"✅ Video uploaded: {video_path}")
        
        # Handle URL (YOUR yt-dlp code will go here)
        elif video_url:
            from services.media_downloader import download_video
            
            result = download_video(video_url)
            
            if not result['success']:
                raise HTTPException(
                    status_code=400,
                    detail=f"Failed to download video: {result['error']}"
                )
            
            video_path = result['video_path']
            print(f"✅ Video downloaded: {video_path}")
        
        # TODO: Run detection pipeline here
        # For now, return mock data
        
        # Mock response (matches frontend expectations)
        response = {
            "overall_confidence": 0.87,
            "classification": "Face Swap",
            "threat_level": "HIGH",
            "visual_score": 0.92,
            "audio_score": 0.85,
            "temporal_score": 0.81,
            "lipsync_score": 0.76,
            "metadata_score": 0.65,
            "message": "Analysis complete (mock data for now)"
        }
        
        # Cleanup
        if video_path and os.path.exists(video_path):
            os.remove(video_path)
            print(f"🗑️  Cleaned up: {video_path}")
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
