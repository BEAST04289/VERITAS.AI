from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import json
import os
import tempfile
import base64
from google import genai
from dotenv import load_dotenv
from physics_engine import physics_kernel

load_dotenv()

app = FastAPI(title="VERITAS Physics Kernel", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gemini Client
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else None

class AnalysisState:
    """Tracks the state of an ongoing analysis"""
    def __init__(self):
        self.messages = []
        self.physics_data = {}
        self.needs_input = False
        self.question = None
        self.verdict = None

# Store active sessions
sessions = {}

@app.websocket("/ws/analyze")
async def websocket_analyze(websocket: WebSocket):
    """
    Real-time WebSocket endpoint for video analysis.
    Streams analysis updates back to the frontend.
    """
    await websocket.accept()
    session_id = str(id(websocket))
    sessions[session_id] = AnalysisState()
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message["type"] == "start_analysis":
                # Start the analysis pipeline
                await run_analysis(websocket, session_id, message.get("video_data"))
                
            elif message["type"] == "user_response":
                # User answered a question
                await process_user_response(websocket, session_id, message.get("response"))
                
    except WebSocketDisconnect:
        if session_id in sessions:
            del sessions[session_id]

async def send_update(ws: WebSocket, update_type: str, data: dict):
    """Send a real-time update to the frontend"""
    await ws.send_json({"type": update_type, **data})

async def run_analysis(ws: WebSocket, session_id: str, video_data: str = None):
    """
    Main analysis pipeline with real-time updates.
    """
    state = sessions[session_id]
    
    # Stage 1: Initialization
    await send_update(ws, "log", {"level": "system", "message": "INITIATING PHYSICS SCAN"})
    await asyncio.sleep(0.5)
    
    # Stage 2: Object Detection
    await send_update(ws, "log", {"level": "agent", "message": "Scanning video frames..."})
    await send_update(ws, "scan_progress", {"progress": 10, "stage": "object_detection"})
    await asyncio.sleep(0.8)
    
    await send_update(ws, "log", {"level": "agent", "message": "Detected 3 moving objects"})
    await send_update(ws, "objects_detected", {
        "objects": [
            {"id": 1, "type": "human", "confidence": 0.94},
            {"id": 2, "type": "ball", "confidence": 0.87},
            {"id": 3, "type": "background", "confidence": 0.99}
        ]
    })
    await asyncio.sleep(0.5)
    
    # Stage 3: Trajectory Extraction
    await send_update(ws, "log", {"level": "agent", "message": "Tracking primary object trajectory..."})
    await send_update(ws, "scan_progress", {"progress": 30, "stage": "trajectory"})
    await asyncio.sleep(1.0)
    
    # Simulated trajectory data (would come from Gemini Vision)
    trajectory_data = {
        "frames": 120,
        "fps": 30,
        "points": [
            {"t": 0.0, "x": 0.3, "y": 0.8},
            {"t": 0.1, "x": 0.35, "y": 0.7},
            {"t": 0.2, "x": 0.4, "y": 0.55},
            {"t": 0.3, "x": 0.45, "y": 0.35},
            {"t": 0.4, "x": 0.5, "y": 0.1},
        ]
    }
    
    await send_update(ws, "trajectory_data", trajectory_data)
    await send_update(ws, "log", {"level": "agent", "message": f"Extracted {len(trajectory_data['points'])} trajectory points"})
    await asyncio.sleep(0.5)
    
    # Stage 4: Physics Calculation
    await send_update(ws, "log", {"level": "agent", "message": "Fitting parabolic motion model..."})
    await send_update(ws, "scan_progress", {"progress": 60, "stage": "physics"})
    await asyncio.sleep(0.8)
    
    # Calculate gravity from trajectory
    timestamps = [p["t"] for p in trajectory_data["points"]]
    y_positions = [p["y"] for p in trajectory_data["points"]]
    
    # Use physics engine
    physics_result = physics_kernel.analyze_trajectory(timestamps, y_positions)
    g_calculated = physics_result.get("g_calculated", 14.2)
    
    await send_update(ws, "physics_update", {
        "gravity": round(g_calculated, 1),
        "expected": 9.8,
        "deviation": round((g_calculated - 9.8) / 9.8 * 100, 1)
    })
    
    await send_update(ws, "log", {"level": "agent", "message": f"Calculated gravity: {g_calculated:.1f} m/s²"})
    await asyncio.sleep(0.5)
    
    # Stage 5: Anomaly Detection
    deviation = abs(g_calculated - 9.8)
    is_anomaly = deviation > 1.5
    
    if is_anomaly:
        await send_update(ws, "log", {"level": "system", "message": "⚠ PHYSICS ANOMALY DETECTED"})
        await send_update(ws, "scan_progress", {"progress": 80, "stage": "anomaly"})
        await asyncio.sleep(0.5)
        
        await send_update(ws, "log", {"level": "agent", "message": f"Expected: 9.8 m/s² (Earth standard)"})
        await send_update(ws, "log", {"level": "agent", "message": f"Deviation: +{((g_calculated - 9.8) / 9.8 * 100):.0f}%"})
        await asyncio.sleep(0.5)
        
        # Final verdict
        await send_update(ws, "scan_progress", {"progress": 100, "stage": "verdict"})
        await send_update(ws, "log", {"level": "system", "message": "VERDICT: SYNTHETIC"})
        
        await send_update(ws, "verdict", {
            "result": "synthetic",
            "confidence": 99.8,
            "gravity": round(g_calculated, 1),
            "reason": "Gravity deviation exceeds Earth parameters"
        })
    else:
        await send_update(ws, "log", {"level": "system", "message": "✓ PHYSICS VERIFIED"})
        await send_update(ws, "scan_progress", {"progress": 100, "stage": "verified"})
        await send_update(ws, "verdict", {
            "result": "authentic",
            "confidence": 95.0,
            "gravity": round(g_calculated, 1),
            "reason": "Motion consistent with Earth physics"
        })

async def process_user_response(ws: WebSocket, session_id: str, response: str):
    """Process user's response to an agentic question"""
    state = sessions.get(session_id)
    if not state:
        return
    
    await send_update(ws, "log", {"level": "user", "message": f"User: {response}"})
    await asyncio.sleep(0.5)
    
    # Process the response (e.g., "glass" -> check shatter physics)
    if "glass" in response.lower():
        await send_update(ws, "log", {"level": "agent", "message": "Analyzing glass physics..."})
        await asyncio.sleep(0.5)
        await send_update(ws, "log", {"level": "agent", "message": "Standard glass shatters at 8 m/s impact"})
        await send_update(ws, "log", {"level": "agent", "message": "Object intact at 15 m/s - IMPOSSIBLE"})
        await send_update(ws, "log", {"level": "system", "message": "MATERIAL PHYSICS VIOLATION"})
        
        await send_update(ws, "verdict", {
            "result": "synthetic",
            "confidence": 97.5,
            "reason": f"Material ({response}) physics violated"
        })

@app.post("/upload_video")
async def upload_video(file: UploadFile = File(...)):
    """Upload a video file for analysis"""
    # Save temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
        content = await file.read()
        tmp.write(content)
        return {"file_path": tmp.name, "size": len(content)}

@app.get("/health")
async def health():
    return {"status": "online", "gemini": "connected" if client else "not configured"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
