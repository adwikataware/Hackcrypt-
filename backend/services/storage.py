import sqlite3
import os
from datetime import datetime
from pathlib import Path

DB_PATH = "storage/deepfake_shield.db"

def init_db():
    """Initialize SQLite database for storing video metadata."""
    os.makedirs("storage", exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS videos (
            id TEXT PRIMARY KEY,
            url TEXT NOT NULL,
            platform TEXT,
            file_path TEXT,
            title TEXT,
            duration INTEGER,
            file_size INTEGER,
            downloaded_at TIMESTAMP,
            analysis_status TEXT,
            threat_level TEXT
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS analyses (
            id TEXT PRIMARY KEY,
            video_id TEXT,
            confidence REAL,
            threat_type TEXT,
            visual_score REAL,
            audio_score REAL,
            temporal_score REAL,
            lipsync_score REAL,
            analyzed_at TIMESTAMP,
            FOREIGN KEY (video_id) REFERENCES videos(id)
        )
    ''')
    
    conn.commit()
    conn.close()

def save_video_metadata(video_id: str, url: str, platform: str, file_path: str, 
                       title: str, duration: int, file_size: int):
    """Save video metadata to database."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO videos 
        (id, url, platform, file_path, title, duration, file_size, downloaded_at, analysis_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (video_id, url, platform, file_path, title, duration, file_size, datetime.now(), 'pending'))
    
    conn.commit()
    conn.close()

def get_video(video_id: str):
    """Get video metadata from database."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM videos WHERE id = ?', (video_id,))
    result = cursor.fetchone()
    conn.close()
    
    return dict(result) if result else None

def list_videos():
    """List all stored videos."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM videos ORDER BY downloaded_at DESC')
    results = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in results]

def update_analysis(video_id: str, analysis_id: str, confidence: float, threat_type: str,
                   visual: float, audio: float, temporal: float, lipsync: float):
    """Save analysis results to database."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Save analysis
    cursor.execute('''
        INSERT INTO analyses 
        (id, video_id, confidence, threat_type, visual_score, audio_score, temporal_score, lipsync_score, analyzed_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (analysis_id, video_id, confidence, threat_type, visual, audio, temporal, lipsync, datetime.now()))
    
    # Update video status
    cursor.execute('UPDATE videos SET analysis_status = ?, threat_level = ? WHERE id = ?',
                  ('completed', threat_type, video_id))
    
    conn.commit()
    conn.close()

# Initialize DB on import
init_db()
