import yt_dlp
import os
import uuid
from typing import Dict, Any


def download_video(url: str, max_duration: int = 30) -> Dict[str, Any]:
    """
    Download video from URL using yt-dlp.
    
    Args:
        url: Video URL (YouTube, Twitter, Instagram, TikTok)
        max_duration: Max seconds to download
        
    Returns:
        {
            'success': bool,
            'video_path': str,
            'metadata': dict,
            'error': str
        }
    """
    
    # Check platform support
    supported_platforms = [
        'youtube.com', 'youtu.be',
        'twitter.com', 'x.com',
        'instagram.com',
        'tiktok.com'
    ]
    
    if not any(platform in url.lower() for platform in supported_platforms):
        return {
            'success': False,
            'error': 'Unsupported platform. Use YouTube, Twitter, Instagram, or TikTok.'
        }
    
    # Generate unique filename
    video_id = str(uuid.uuid4())[:8]
    output_dir = "temp/videos"
    os.makedirs(output_dir, exist_ok=True)
    output_template = os.path.join(output_dir, f"{video_id}.%(ext)s")
    
    # yt-dlp options
    ydl_opts = {
        'format': 'bestvideo[height<=720]+bestaudio/best[height<=720]/best',
        'outtmpl': output_template,
        'merge_output_format': 'mp4',
        'quiet': True,
        'no_warnings': True,
    }
    
    try:
        print(f"⏬ Downloading from: {url}")
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            video_path = ydl.prepare_filename(info)
            
            # Ensure .mp4 extension
            if not video_path.endswith('.mp4'):
                base = os.path.splitext(video_path)[0]
                video_path = base + '.mp4'
            
            # Verify file exists
            if not os.path.exists(video_path):
                return {
                    'success': False,
                    'error': f'Download succeeded but file not found at: {video_path}'
                }
            
            file_size_mb = os.path.getsize(video_path) / (1024 * 1024)
            
            print(f"✅ Downloaded successfully!")
            print(f"📄 File: {video_path}")
            print(f"💾 Size: {file_size_mb:.2f} MB")
            
            return {
                'success': True,
                'video_path': video_path,
                'metadata': {
                    'title': info.get('title', 'Unknown'),
                    'uploader': info.get('uploader', 'Unknown'),
                    'duration': info.get('duration', 0),
                    'platform': info.get('extractor', 'Unknown'),
                    'file_size_mb': round(file_size_mb, 2)
                }
            }
            
    except Exception as e:
        error_msg = str(e)
        print(f"❌ Download failed: {error_msg}")
        
        return {
            'success': False,
            'error': error_msg
        }
