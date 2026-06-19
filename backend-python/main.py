import os
import requests
import io
import csv
import redis
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import StreamingResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🚀 Configure Google Gemini
# DON'T FORGET TO PASTE YOUR ACTUAL API KEY HERE LATER!
API_KEY = "GEMINI_API_KEY"

MODEL_NAME = "gemini-2.5-flash"
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent?key={API_KEY}"

# 🛡️ REDIS CONNECTION
# Connects to the Redis container running on your Codespace
try:
    redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
    redis_client.ping() # Test connection
    print("✅ Connected to Redis successfully!")
except redis.ConnectionError:
    print("⚠️ Warning: Redis is not running! Rate limiting will be disabled.")
    redis_client = None

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def read_root():
    return {"status": "Mezbaan Python AI Microservice is running with Gemini and Redis!"}

@app.post("/api/ai/chat")
def chat_with_ai(request: Request, chat_request: ChatRequest):
    # 🛡️ REDIS RATE LIMITING LOGIC
    if redis_client:
        client_ip = request.client.host
        requests_made = redis_client.get(client_ip)
        
        if requests_made and int(requests_made) >= 5:
            # Block the user! 429 means "Too Many Requests"
            return {"response": "SYSTEM SHIELD: You are talking too fast! Please wait 60 seconds before sending another message."}
        
        # Log the request and set it to expire in 60 seconds
        pipe = redis_client.pipeline()
        pipe.incr(client_ip)
        pipe.expire(client_ip, 60)
        pipe.execute()

    # --- GEMINI AI LOGIC ---
    try:
        ai_context = (
            "You are the intelligent, polite culinary assistant for an upscale "
            "restaurant called Mezbaan. Keep your answers brief and friendly. "
            f"The customer says: {chat_request.message}"
        )
        
        payload = {"contents": [{"parts": [{"text": ai_context}]}]}
        response = requests.post(GEMINI_URL, headers={"Content-Type": "application/json"}, json=payload)
        response_data = response.json()
        
        if response.status_code == 200:
            reply = response_data["candidates"][0]["content"]["parts"][0]["text"]
            return {"response": reply}
        else:
            error_msg = response_data.get("error", {}).get("message", "Unknown API Error")
            return {"response": f"DEBUG ERROR: {error_msg}"}
            
    except Exception as e:
        return {"response": f"DEBUG ERROR: {str(e)}"}

# 🚀 Data Export Engine
@app.get("/api/admin/export/csv")
def export_csv():
    data = [
        ["Booking ID", "Customer Role", "Table Number", "Status", "Amount Paid"],
        ["MZB-1001", "Super Admin", "Table 1", "OCCUPIED", "$45.00"],
        ["MZB-1002", "Guest User", "Table 2", "CONFIRMED", "$120.00"],
        ["MZB-1003", "Guest User", "Table 4", "PENDING", "$0.00"]
    ]
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerows(data)
    output.seek(0)
    
    return StreamingResponse(
        output, 
        media_type="text/csv", 
        headers={"Content-Disposition": "attachment; filename=mezbaan_live_report.csv"}
    )
