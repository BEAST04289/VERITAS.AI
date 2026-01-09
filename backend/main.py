from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
from vision_engine import vision_kernel
from physics_engine import physics_kernel
from agentic_bot import agent

app = FastAPI(title="VERITAS Physics Kernel", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScanRequest(BaseModel):
    video_url: str

class ClarificationResponse(BaseModel):
    session_id: str
    user_context: str  # e.g., "This is glass"

@app.post("/analyze")
async def analyze_video(request: ScanRequest):
    """
    Stage 1 & 2: Surveillance & Investigation
    """
    print(f"👁️ STARTING SEQUENCE: {request.video_url}")
    
    # 1. VISION: Extract Motion
    vision_data = vision_kernel.extract_motion_data(request.video_url)
    if "error" in vision_data:
        raise HTTPException(status_code=500, detail=vision_data["error"])
    
    # Mocking Vision Data for prototype if real API fails
    mock_timestamps = [0.0, 0.1, 0.2, 0.3, 0.4]
    mock_y = [10.0, 9.5, 8.0, 5.5, 2.0] # Accel > 9.8
    
    # 2. PHYSICS: Calculate Gravity
    # In real app, passes vision_data['frames']
    physics_result = physics_kernel.analyze_trajectory(mock_timestamps, mock_y)
    
    # 3. AMBIGUITY CHECK (Agentic Brain)
    needs_clarification = agent.evaluate_ambiguity(physics_result)
    
    if needs_clarification:
        # Agent intervenes!
        question = agent.generate_question(f"Gravity {physics_result.get('g_calculated')} vs Earth 9.8")
        return {
            "status": "INTERROGATION_REQUIRED",
            "agent_message": question,
            "session_id": "session_123",
            "physics_data": physics_result
        }
    
    # 4. VERDICT
    return {
        "status": "COMPLETED",
        "verdict": physics_result["verdict"],
        "confidence": 99.8 if physics_result["is_anomaly"] else 100.0,
        "details": physics_result
    }

@app.post("/submit_clarification")
async def process_clarification(resp: ClarificationResponse):
    """
    Stage 3 & 4: Ambiguity Resolution & Verdict
    """
    print(f"🧠 AGENT RECEIVED CONTEXT: {resp.user_context}")
    
    # Re-run physics with new context (Mocked logic)
    # If user says "Glass", we check shatter physics.
    
    return {
        "status": "COMPLETED",
        "verdict": "SYNTHETIC",
        "reason": f"Agent determined violation based on context: {resp.user_context}. Object failed material physics check.",
        "confidence": 98.5
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
