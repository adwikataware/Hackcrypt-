from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import uuid
import shutil

app = FastAPI(title="DeepFake Shield API")

# CORS - Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://192.168.0.108:5174"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import routes
from routes import detect, download

app.include_router(detect.router, prefix="/api", tags=["detection"])
app.include_router(download.router, prefix="/api", tags=["download"])

@app.get("/")
def root():
    return {
        "message": "DeepFake Shield API",
        "status": "running",
        "version": "1.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
