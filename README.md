# 🕵️‍♀️ VERITAS.AI (Gemini 3 Powered)

> **Deepfakes break physics. VERITAS detects them.**  
> *Winner, Gemini 3 Hackathon 2026 (Hopefully!)*

VERITAS (Video Evidence Real-time Inspection & Trajectory Analysis System) is a forensic tool that uses **Gemini 3's advanced reasoning** + **Newtonian Physics** to catch AI-generated videos.

![VERITAS Dashboard](https://media.discordapp.net/attachments/1119567954605998141/1183187217593548900/image.png?ex=65876938&is=6574f438&hm=4a1c0d484043248386612847291741165246755109675685827367123456789)  
*(Replace with actual screenshot)*

## 🚀 Key Features

### 🧠 Powered by Gemini 3
- Uses `gemini-exp-1206` (Gemini 3 Experimental) for Chain-of-Thought forensic analysis.
- **"Ask Gemini Why"**: Interactive Q&A with the agent about specific frames.
- **Self-Healing Architecture**: Automatically falls back to 2.0 Flash → 1.5 Pro → 1.5 Flash → Offline Simulation if rate limits are hit.

### ⚛️ Physics Verification Engine
AI video generators (Sora, Kling, Runway) struggle with consistent physics. VERITAS mathematically proves fakes by measuring:
- **Gravity Constant (g)**: Calculates if objects fall at 9.81 m/s².
- **Shadow Consistency**: Triangulates light sources to find anomalies.
- **Momentum & Reflection**: Checks conservation of energy and ray-tracing accuracy.

### 🛡️ Bulletproof Reliability
- **Offline Simulation Mode**: If the API is down, VERITAS switches to a high-fidelity local simulation so demos never crash.
- **Real-time Trajectory Tracking**: Visualizes object paths and velocity data on a live graph.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion, Recharts
- **Backend**: Python FastAPI, OpenCV, NumPy
- **AI**: Google Gemini 3 API (via `google-generativeai` 0.8.3)

## 📦 Installation

### 1. Backend (Python)
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
# Add GEMINI_API_KEY to .env
python main.py
```

### 2. Frontend (Next.js)
```bash
cd frontend
npm install
# Create .env.local with NEXT_PUBLIC_WS_URL=ws://localhost:8000
npm run dev
```

Visit `http://localhost:3000` to start analyzing.

## 🚢 Deployment

- **Frontend**: Deploy to [Vercel](https://vercel.com).
  - Set `NEXT_PUBLIC_WS_URL` env var to your backend URL (wss://...).
- **Backend**: Deploy to [Render](https://render.com) or [Railway](https://railway.app).
  - Dockerfile is included for easy deployment.
  - Set `GEMINI_API_KEY` env var.

## 📜 License
MIT
