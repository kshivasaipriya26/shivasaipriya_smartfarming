
import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sarvamai import SarvamAI
from sarvamai.core.api_error import ApiError
from nlp_pipeline import detect_language,analyze_farming_query

# Load environment variables from backend/.env
load_dotenv(Path(__file__).resolve().parent / ".env")

API_KEY = os.getenv("SARVAM_API_KEY", "").strip()

client = SarvamAI(api_subscription_key=API_KEY) if API_KEY else None

app = FastAPI(title="Smart Farming Assistant API")

# Allow the Next.js frontend to call the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    language: str = "en"


class ChatResponse(BaseModel):
    answer: str
    language: str
    intent: str = "general"
    crop: str | None = None


@app.get("/")
def home():
    return {
        "message": "Smart Farming Assistant API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "sarvam_key_configured": bool(API_KEY),
    }


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    message = request.message.strip()

    if not message:
        raise HTTPException(
            status_code=422,
            detail="Message cannot be empty",
        )
    language = detect_language(
    request.message,
    request.language
)

    analysis = analyze_farming_query(request.message)

    print("Detected language:", language)
    print("NLP analysis:", analysis)

    if client is None:
        raise HTTPException(
            status_code=500,
            detail="SARVAM_API_KEY is missing from backend/.env",
        )

    try:
        response = client.chat.completions(
            model="sarvam-105b",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a helpful Smart Farming Assistant. "
                        "Give clear, practical farming advice. "
                        "Explain crop care, irrigation, soil health, "
                        "pest prevention, and sustainable farming. "
                        "Avoid claiming certainty when information is "
                        "insufficient. Reply in the requested language "
                        "when possible."
                    ),
                },
                {
                    "role": "user",
                    "content": (
                        f"Preferred language: {request.language}\n"
                        f"Farmer's question: {message}"
                    ),
                },
            ],
        )

        answer = response.choices[0].message.content

        if not answer:
            raise HTTPException(
                status_code=502,
                detail="Sarvam returned an empty response.",
            )

        return ChatResponse(
            answer=answer,
            language=request.language,
            intent="general",
            crop=None,
        )

    except ApiError as e:
        # Log the provider's actual error in the backend terminal.
        # Never print the API key.
        print("Sarvam HTTP status:", e.status_code)
        print("Sarvam error details:", e.body)

        raise HTTPException(
            status_code=502,
            detail=(
                "Sarvam AI request failed. Check the backend "
                "terminal for the actual provider error."
            ),
        ) from e

    except HTTPException:
        raise

    except ApiError as e:
     print("Sarvam HTTP status:", e.status_code, flush=True)
    print("Sarvam error details:", e.body, flush=True)

    raise HTTPException(
        status_code=502,
        detail="Sarvam request failed. Check the backend terminal."
    ) from e
