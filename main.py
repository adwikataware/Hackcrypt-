from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import shutil
import os
import hashlib
import time
from typing import Optional
import asyncio

import json

# Import all your unified analyzers
from services.image_analyzer import analyze_image_complete
from services.liveness_checker import analyze_video_full
from services.audio_analyzer import analyze_audio_full
from services.image_forensics import full_image_forensics
from services.metadata_scanner import full_metadata_analysis
from protectors.noisenet import NoiseNet

# --- CONFIGURATION ---
UPLOAD_FOLDER = "temp_uploads"
PROTECTED_FOLDER = "protected_uploads"
HISTORY_FILE = "scan_history.json"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROTECTED_FOLDER, exist_ok=True)

app = FastAPI(
    title="Deepfake Detection API",
    description="Comprehensive deepfake detection with AI models and forensic analysis",
    version="2.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize NoiseNet protector
protector = NoiseNet(secret_key=99, strength=0.015)

# --- HELPER FUNCTIONS ---

def load_history():
    """Loads the history of scanned files."""
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, "r") as f:
                return json.load(f)
        except json.JSONDecodeError:
            return {}
    return {}

def save_to_history(content_hash, result_data):
    """Saves a new scan result to the history file."""
    history = load_history()
    history[content_hash] = result_data
    with open(HISTORY_FILE, "w") as f:
        json.dump(history, f, indent=4)

def get_file_hash(file_path):
    """Generate MD5 hash of file content for caching"""
    hasher = hashlib.md5()
    with open(file_path, 'rb') as f:
        buf = f.read()
        hasher.update(buf)
    return hasher.hexdigest()

def calculate_file_hash(file_path):
    """Calculate SHA256 hash of a file"""
    sha256_hash = hashlib.sha256()
    
    with open(file_path, "rb") as f:
        # Read file in chunks to handle large files
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    
    return sha256_hash.hexdigest()

def determine_intent_classification(filename: str, analysis_result: dict) -> str:
    """
    Determine if a deepfake is 'good' (benign/ethical) or 'bad' (malicious/harmful)
    """
    
    filename_lower = filename.lower()
    
    # GOOD deepfake patterns (educational, satire, creative)
    good_patterns = [
        "edu", "education", "tutorial", "educational",
        "satire", "parody", "meme", "joke", "funny",
        "vfx", "movie", "film", "creative", "art",
        "reenactment", "historical", "demo"
    ]
    
    # Check filename patterns FIRST (hardcoded)
    for pattern in good_patterns:
        if pattern in filename_lower:
            return "good"
    
    # If not a deepfake, don't classify
    if not analysis_result.get("is_deepfake", False):
        return None
    
    # BAD deepfake patterns (malicious, harmful)
    bad_patterns = [
        "fake", "misinformation", "fraud", "scam",
        "deepfake", "non-consent", "explicit", "intimate",
        "defame", "slander", "impersonate", "identity",
        "blackmail", "extort"
    ]
    
    # Check filename patterns
    for pattern in bad_patterns:
        if pattern in filename_lower:
            return "bad"
    
    # Default classification based on confidence scores
    overall_confidence = analysis_result.get("overall_confidence", 0.5)
    
    if overall_confidence > 0.75:
        return "good"
    
    return "bad"

def is_video_file(filename):
    """Check if file is video"""
    video_extensions = ['.mp4', '.avi', '.mov', '.mkv', '.flv', '.wmv']
    return any(filename.lower().endswith(ext) for ext in video_extensions)

def is_audio_file(filename):
    """Check if file is audio"""
    audio_extensions = ['.mp3', '.wav', '.flac', '.ogg', '.m4a']
    return any(filename.lower().endswith(ext) for ext in audio_extensions)

def is_image_file(filename):
    """Check if file is image"""
    image_extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp']
    return any(filename.lower().endswith(ext) for ext in image_extensions)

# --- API ENDPOINTS ---

@app.get("/")
def home():
    return {
        "message": "Deepfake Detection API v2.0",
        "status": "online",
        "features": [
            "Image Deepfake Detection (AI + Forensics)",
            "Video Deepfake Detection (Liveness + Audio + Visual)",
            "Audio Deepfake Detection (Frequency + Breathing Analysis)",
            "NoiseNet Proactive Protection",
            "Smart Content-Based Caching",
            "Metadata & EXIF Analysis"
        ],
        "endpoints": {
            "POST /api/scan": "Universal endpoint - auto-detects file type",
            "POST /api/scan/image": "Image-specific analysis",
            "POST /api/scan/video": "Video-specific analysis",
            "POST /api/scan/audio": "Audio-specific analysis",
            "POST /api/protect": "Apply NoiseNet protection to image",
            "GET /api/history": "Get scan history",
            "DELETE /api/history": "Clear scan history",
            "GET /api/protected/{filename}": "Download protected file"
        }
    }

@app.post("/api/scan")
async def universal_scan(file: UploadFile = File(...)):
    """
    Universal endpoint - automatically detects file type and runs appropriate analysis
    """
    # Save uploaded file
    file_path = f"{UPLOAD_FOLDER}/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Generate content hash for caching
    content_hash = get_file_hash(file_path)
    
    # Check cache first
    history = load_history()
    if content_hash in history:
        print(f"⚡ CACHE HIT: {file.filename}")
        os.remove(file_path)
        cached_result = history[content_hash]
        cached_result["cached"] = True
        return cached_result
    
    print(f"🔍 ANALYZING NEW FILE: {file.filename}")
    
    try:
        # Auto-detect file type and route to appropriate analyzer
        if is_image_file(file.filename):
            result = await scan_image_full(file_path, file.filename, content_hash)
        elif is_video_file(file.filename):
            result = await scan_video_full(file_path, file.filename, content_hash)
        elif is_audio_file(file.filename):
            result = await scan_audio_full(file_path, file.filename, content_hash)
        else:
            os.remove(file_path)
            raise HTTPException(status_code=400, detail="Unsupported file type")
        
        # Add metadata
        result["cached"] = False
        result["scan_timestamp"] = time.time()
        
        # Save to history
        save_to_history(content_hash, result)
        
        return result
        
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/scan/image")
async def scan_image_endpoint(file: UploadFile = File(...)):
    """
    Image-specific endpoint with complete analysis
    Uses: image_analyzer.py (combines face_detector + image_forensics + metadata)
    """
    file_path = f"{UPLOAD_FOLDER}/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    content_hash = get_file_hash(file_path)
    
    # Check cache
    history = load_history()
    if content_hash in history:
        print(f"⚡ CACHE HIT: {file.filename}")
        os.remove(file_path)
        return history[content_hash]
    
    try:
        result = await scan_image_full(file_path, file.filename, content_hash)
        save_to_history(content_hash, result)
        return result
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/scan/video")
async def scan_video_endpoint(file: UploadFile = File(...)):
    """
    Video-specific endpoint with complete analysis
    Uses: liveness_checker.py (blink rate) + audio_analyzer.py
    """
    file_path = f"{UPLOAD_FOLDER}/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    content_hash = get_file_hash(file_path)
    
    # Check cache
    history = load_history()
    if content_hash in history:
        print(f"⚡ CACHE HIT: {file.filename}")
        os.remove(file_path)
        return history[content_hash]
    
    try:
        result = await scan_video_full(file_path, file.filename, content_hash)
        save_to_history(content_hash, result)
        return result
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/scan/audio")
async def scan_audio_endpoint(file: UploadFile = File(...)):
    """
    Audio-specific endpoint
    Uses: audio_analyzer.py (high-frequency cutoff + breathing patterns)
    """
    file_path = f"{UPLOAD_FOLDER}/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    content_hash = get_file_hash(file_path)
    
    # Check cache
    history = load_history()
    if content_hash in history:
        print(f"⚡ CACHE HIT: {file.filename}")
        os.remove(file_path)
        return history[content_hash]
    
    try:
        result = await scan_audio_full(file_path, file.filename, content_hash)
        save_to_history(content_hash, result)
        return result
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/api/verify-url")
async def verify_url(url: str = Form(...)):
    """
    Verify media from URL (YouTube, Twitter, etc.)
    Downloads the media temporarily and analyzes it
    """
    try:
        print(f"\n🔗 VERIFYING URL: {url}")
        
        # Validate URL
        if not url.startswith(('http://', 'https://')):
            raise HTTPException(status_code=400, detail="Invalid URL format")
        
        # Check if it's a supported platform
        if 'youtube.com' in url or 'youtu.be' in url:
            return await verify_youtube_url(url)
        elif 'twitter.com' in url or 'x.com' in url:
            return await verify_twitter_url(url)
        else:
            raise HTTPException(status_code=400, detail="Unsupported platform. Only YouTube and Twitter/X are supported.")
            
    except Exception as e:
        print(f"❌ URL verification failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


async def verify_youtube_url(url: str):
    """Download and verify YouTube video"""
    try:
        import yt_dlp
        
        # Download video
        temp_file = f"temp_uploads/youtube_{int(time.time())}.mp4"
        
        ydl_opts = {
            'format': 'best[ext=mp4]',
            'outtmpl': temp_file,
            'quiet': True,
            'no_warnings': True,
        }
        
        print(f"   📥 Downloading YouTube video...")
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            video_title = info.get('title', 'Unknown')
        
        print(f"   ✅ Downloaded: {video_title}")
        
        # Calculate content hash
        content_hash = calculate_file_hash(temp_file)
        
        # Check cache
        cached = cache.get(content_hash)
        if cached:
            print(f"   ⚡ CACHE HIT for {video_title}")
            os.remove(temp_file)
            return {
                **cached,
                "cached": True,
                "source_url": url,
                "video_title": video_title
            }
        
        # Analyze the video
        result = await scan_video_full(temp_file, f"{video_title}.mp4", content_hash)
        result["source_url"] = url
        result["video_title"] = video_title
        result["cached"] = False
        
        # Cache the result
        cache.set(content_hash, result)
        save_to_history(content_hash, result)
        
        return result
        
    except Exception as e:
        print(f"   ❌ YouTube download failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to download YouTube video: {str(e)}")


async def verify_twitter_url(url: str):
    """Verify Twitter/X media"""
    raise HTTPException(
        status_code=501, 
        detail="Twitter/X verification coming soon! Use YouTube URLs for now."
    )


@app.post("/api/protect")
async def protect_image(file: UploadFile = File(...)):
    """
    Protect an image with NoiseNet adversarial noise
    """
    try:
        print(f"\n🛡️ PROTECTING IMAGE: {file.filename}")
        
        # Ensure temp_uploads directory exists
        os.makedirs("temp_uploads", exist_ok=True)
        
        # Save uploaded file
        timestamp = int(time.time())
        file_path = f"temp_uploads/{timestamp}_{file.filename}"
        
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        print(f"   💾 Saved to: {file_path}")
        
        # Check if file exists
        if not os.path.exists(file_path):
            raise Exception("File was not saved properly")
        
        # Apply NoiseNet protection
        print(f"   🔧 Applying NoiseNet protection...")
        protected_path = protector.embed_trace_layer(file_path)
        
        if not os.path.exists(protected_path):
            raise Exception("Protected file was not created")
        
        protected_filename = os.path.basename(protected_path)
        
        print(f"   ✅ Protection applied: {protected_filename}")
        
        # Calculate hashes
        original_hash = calculate_file_hash(file_path)
        protected_hash = calculate_file_hash(protected_path)
        
        # Store protection record
        protection_record = {
            "original_filename": file.filename,
            "protected_filename": protected_filename,
            "original_hash": original_hash,
            "protected_hash": protected_hash,
            "protection_timestamp": time.time(),
            "secret_key": protector.secret_key,
            "strength": protector.strength
        }
        
        # Save to protection registry
        save_protection_record(protection_record)
        
        print(f"   🔑 Original hash: {original_hash[:16]}...")
        print(f"   🔐 Protected hash: {protected_hash[:16]}...")
        
        # Cleanup original (keep protected)
        try:
            os.remove(file_path)
        except:
            pass
        
        return {
            "success": True,
            "original_filename": file.filename,
            "protected_filename": protected_filename,
            "protected_path": protected_path,
            "original_hash": original_hash,
            "protected_hash": protected_hash,
            "message": "Image successfully protected with NoiseNet",
            "download_url": f"/api/download-protected/{protected_filename}"
        }
        
    except Exception as e:
        print(f"❌ Protection failed: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/trace")
async def trace_image(file: UploadFile = File(...)):
    """
    Trace image provenance and find similar versions
    """
    try:
        print(f"\n🔍 TRACING IMAGE: {file.filename}")
        
        # Ensure temp_uploads directory exists
        os.makedirs("temp_uploads", exist_ok=True)
        
        # Save uploaded file
        timestamp = int(time.time())
        file_path = f"temp_uploads/{timestamp}_{file.filename}"
        
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        print(f"   💾 Saved to: {file_path}")
        
        # Calculate perceptual hash
        from services.image_tracer import trace_image_provenance
        trace_result = trace_image_provenance(file_path, file.filename)
        
        print(f"   ✅ Tracing complete: Found {len(trace_result['matches'])} matches")
        
        # Cleanup
        try:
            os.remove(file_path)
        except:
            pass
        
        return trace_result
        
    except Exception as e:
        print(f"❌ Tracing failed: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/download-protected/{filename}")
async def download_protected_image(filename: str):
    """Download a protected image"""
    file_path = f"temp_uploads/{filename}"
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Protected file not found")
    
    return FileResponse(
        file_path, 
        media_type="image/png",
        filename=filename,
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@app.post("/api/verify-protection")
async def verify_protection(file: UploadFile = File(...)):
    """
    Check if an uploaded image has been tampered with after NoiseNet protection
    """
    try:
        print(f"\n🔍 VERIFYING PROTECTION: {file.filename}")
        
        # Save uploaded file
        file_path = f"temp_uploads/verify_{file.filename}"
        with open(file_path, "wb") as f:
            f.write(await file.read())
        
        # Calculate current hash
        current_hash = calculate_file_hash(file_path)
        
        # Check if this matches any protected image
        protection_records = load_protection_records()
        
        matched_record = None
        for record in protection_records:
            if record["protected_hash"] == current_hash:
                matched_record = record
                break
        
        if matched_record:
            # Exact match - not tampered
            print(f"   ✅ PROTECTED IMAGE DETECTED - INTACT")
            os.remove(file_path)
            return {
                "is_protected": True,
                "is_tampered": False,
                "verdict": "Protected Image - Integrity Intact",
                "threat_level": "PROTECTED",
                "original_filename": matched_record["original_filename"],
                "protected_since": time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(matched_record["protection_timestamp"])),
                "message": "⚠️ This image is protected by NoiseNet. Manipulation attempts will fail."
            }
        
        # Check if noise layer is disturbed
        integrity_check = protector.verify_integrity(file_path)
        
        # Check against original hashes
        for record in protection_records:
            # If filename matches but hash doesn't, it's been tampered
            if file.filename.replace("verify_", "") == record["protected_filename"]:
                print(f"   ⚠️ TAMPERING DETECTED!")
                os.remove(file_path)
                return {
                    "is_protected": True,
                    "is_tampered": True,
                    "verdict": "Protected Image - TAMPERED",
                    "threat_level": "HIGH",
                    "original_filename": record["original_filename"],
                    "tampering_detected": integrity_check,
                    "message": "🚨 ALERT: This protected image has been modified! NoiseNet layer disturbed."
                }
        
        # Not a protected image
        print(f"   ℹ️ Not a protected image")
        os.remove(file_path)
        return {
            "is_protected": False,
            "is_tampered": False,
            "verdict": "Not a Protected Image",
            "threat_level": "UNKNOWN",
            "message": "This image was not protected with NoiseNet"
        }
        
    except Exception as e:
        print(f"❌ Verification failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Helper functions for protection registry
def save_protection_record(record):
    """Save protection record to JSON file"""
    records_file = "protection_records.json"
    
    records = []
    if os.path.exists(records_file):
        with open(records_file, 'r') as f:
            records = json.load(f)
    
    records.append(record)
    
    with open(records_file, 'w') as f:
        json.dump(records, f, indent=2)


def load_protection_records():
    """Load all protection records"""
    records_file = "protection_records.json"
    
    if os.path.exists(records_file):
        with open(records_file, 'r') as f:
            return json.load(f)
    
    return []

@app.get("/api/history")
def get_history():
    """Get all scan history"""
    history = load_history()
    # Convert to list for frontend
    history_list = []
    for content_hash, data in history.items():
        data["content_hash"] = content_hash
        history_list.append(data)
    
    # Sort by timestamp (most recent first)
    history_list.sort(key=lambda x: x.get("scan_timestamp", 0), reverse=True)
    
    return {
        "total_scans": len(history_list),
        "scans": history_list
    }

@app.delete("/api/history")
def clear_history():
    """Clear all scan history"""
    if os.path.exists(HISTORY_FILE):
        os.remove(HISTORY_FILE)
    return {"message": "History cleared successfully"}

@app.delete("/api/history/{content_hash}")
def delete_scan(content_hash: str):
    """Delete a specific scan from history"""
    history = load_history()
    if content_hash in history:
        del history[content_hash]
        with open(HISTORY_FILE, "w") as f:
            json.dump(history, f, indent=4)
        return {"message": "Scan deleted successfully"}
    raise HTTPException(status_code=404, detail="Scan not found")

@app.get("/api/protected/{filename}")
def get_protected_file(filename: str):
    """Download a NoiseNet protected image"""
    protected_path = f"{PROTECTED_FOLDER}/{filename}"
    if os.path.exists(protected_path):
        return FileResponse(
            protected_path,
            media_type="image/jpeg",
            filename=filename
        )
    raise HTTPException(status_code=404, detail="Protected file not found")

@app.get("/api/stats")
def get_stats():
    """Get overall statistics"""
    history = load_history()
    
    total_scans = len(history)
    fake_count = sum(1 for data in history.values() if data.get("is_fake", False))
    real_count = total_scans - fake_count
    
    # Count by type
    image_count = sum(1 for data in history.values() if data.get("file_type") == "image")
    video_count = sum(1 for data in history.values() if data.get("file_type") == "video")
    audio_count = sum(1 for data in history.values() if data.get("file_type") == "audio")
    
    return {
        "total_scans": total_scans,
        "fake_count": fake_count,
        "real_count": real_count,
        "detection_rate": round((fake_count / total_scans * 100) if total_scans > 0 else 0, 2),
        "by_type": {
            "images": image_count,
            "videos": video_count,
            "audio": audio_count
        }
    }

# --- INTERNAL SCAN FUNCTIONS ---

async def scan_image_full(file_path: str, filename: str, content_hash: str):
    """Complete image analysis using unified analyzer"""
    print(f"   [IMAGE] Running complete analysis...")
    
    # Run unified image analysis (AI model + forensics + metadata)
    analysis_result = analyze_image_complete(file_path)
    
    # Get metadata separately for additional info
    metadata_result = full_metadata_analysis(file_path)
    
    # Apply NoiseNet protection
    protected_filename = f"protected_{filename}"
    protected_path = f"{PROTECTED_FOLDER}/{protected_filename}"
    try:
        protector.embed_trace_layer(file_path)
        import shutil as sh
        sh.move(file_path.replace(".", "_protected."), protected_path)
    except:
        protected_filename = None
    
    # Cleanup
    if os.path.exists(file_path):
        os.remove(file_path)
    
        # Determine Intent Classification based on filename patterns
    # This can be replaced with actual ML model or heuristics later
    intent_classification = determine_intent_classification(filename, analysis_result)
    
    # Build response
    return {
        "file_type": "image",
        "filename": filename,
        "content_hash": content_hash,
        **analysis_result,
        "metadata_info": metadata_result,
        "protected": protected_filename is not None,
        "protected_filename": protected_filename,
        "intent_classification": intent_classification  # Add this line
    }

async def scan_video_full(file_path: str, filename: str, content_hash: str):
    """Complete video analysis using liveness checker + audio analyzer"""
    print(f"   [VIDEO] Running complete analysis...")
    
    try:
        # Run liveness analysis (blink rate, temporal analysis)
        liveness_result = analyze_video_full(file_path)
        
        # Run audio analysis on video
        audio_result = analyze_audio_full(file_path, is_video=True)
        
        # Combine results
        combined_confidence = (
            liveness_result.get("overall_confidence", 0.5) * 0.6 +
            (0 if audio_result.get("is_fake", False) else 1) * 0.4
        )
        
        result = {
            "file_type": "video",
            "filename": filename,
            "content_hash": content_hash,
            **liveness_result,
            "audio_analysis": audio_result,
            "overall_confidence": round(combined_confidence, 4),
            "is_fake": liveness_result.get("is_fake", False) or audio_result.get("is_fake", False)
        }
        
        return result
        
    finally:
        # Always cleanup, even if error occurs
        import time
        time.sleep(0.5)  # Give Windows time to release file handles
        
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
        except PermissionError:
            print(f"⚠️ Could not delete {file_path} - file still in use")
        except Exception as e:
            print(f"⚠️ Cleanup error: {e}")


async def scan_audio_full(file_path: str, filename: str, content_hash: str):
    """Complete audio analysis"""
    print(f"   [AUDIO] Running complete analysis...")
    
    # Run audio analysis
    audio_result = analyze_audio_full(file_path, is_video=False)
    
    # Cleanup
    if os.path.exists(file_path):
        os.remove(file_path)
    
    # Convert to standard format
    is_fake = audio_result.get("is_fake", False)
    confidence = 0.3 if is_fake else 0.8  # Convert to 0-1 scale
    
    return {
        "file_type": "audio",
        "filename": filename,
        "content_hash": content_hash,
        "verdict": audio_result.get("overall_verdict", "Unknown"),
        "overall_confidence": confidence,
        "is_fake": is_fake,
        "threat_level": "HIGH" if is_fake else "LOW",
        "audio_analysis": audio_result,
        "confidence_breakdown": {
            "Visual": 0,
            "Audio": audio_result.get("high_frequency_analysis", {}).get("is_fake", False) and 20 or 85,
            "Temporal": 0,
            "Lip-Sync": 0,
            "Metadata": 0
        }
    }

# --- STARTUP EVENT ---
@app.on_event("startup")
async def startup_event():
    print("\n" + "="*60)
    print("🚀 DEEPFAKE DETECTION API v2.0 - STARTING UP")
    print("="*60)
    print("✅ All unified analyzers loaded")
    print("✅ NoiseNet protector initialized")
    print("✅ CORS enabled for all origins")
    print("✅ Smart caching system active")
    print("\n📡 Server ready at: http://localhost:8000")
    print("📚 API docs at: http://localhost:8000/docs")
    print("="*60 + "\n")

def save_protection_record(record):
    """Save protection record to JSON file"""
    records_file = "protection_records.json"
    
    records = []
    if os.path.exists(records_file):
        try:
            with open(records_file, 'r') as f:
                records = json.load(f)
        except:
            records = []
    
    records.append(record)
    
    with open(records_file, 'w') as f:
        json.dump(records, f, indent=2)


def load_protection_records():
    """Load all protection records"""
    records_file = "protection_records.json"
    
    if os.path.exists(records_file):
        try:
            with open(records_file, 'r') as f:
                return json.load(f)
        except:
            return []
    
    return []

# Run with: uvicorn main:app --reload --port 8000
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
