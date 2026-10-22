# Smart Farming Assistant

A beginner-friendly full-stack demo with:
- Next.js frontend (`http://localhost:3000`)
- FastAPI backend (`http://localhost:8000`)
- English, Hindi, and Kannada response templates
- Basic crop knowledge and rule-based intent detection
- API health check and chat endpoint
- A safe placeholder for adding Sarvam AI when you have an API key

> This is a prototype, not a substitute for local agricultural extension advice. Recommendations vary by region, crop variety, soil, weather, and growth stage.

## Project structure

```text
smart-farming-assistant/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── .env.local.example
    └── package.json
```

## 1. Run the backend (VS Code terminal 1)

Open the `backend` folder in the terminal:

```powershell
cd backend
py -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn main:app --reload --port 8000
```

If PowerShell blocks virtual-environment activation, use the venv Python directly:

```powershell
.\venv\Scripts\python.exe -m pip install -r requirements.txt
.\venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```

Check `http://localhost:8000/health` and API documentation at `http://localhost:8000/docs`.

## 2. Run the frontend (VS Code terminal 2)

From the project root:

```powershell
cd frontend
npm install
Copy-Item .env.local.example .env.local
npm run dev
```

Open `http://localhost:3000`.

If `npm` is not recognized, install the current Node.js LTS release and reopen VS Code.

## How the integration works

The Next.js page sends `POST http://localhost:8000/api/chat` with a JSON body:
```json
{"message":"How should I care for rice?","language":"en"}
```
FastAPI returns the answer, detected intent, and language. The frontend displays the answer in the chat.

## Sarvam AI integration

The app works without an API key using local demo language handling. When you obtain a Sarvam API key:
1. Store it in `backend/.env` as `SARVAM_API_KEY=...` (never paste it into chat or commit it).
2. Use the official Sarvam API documentation to choose the current language-detection/translation endpoint and request format.
3. Replace the `detect_language()` placeholder in `backend/main.py` with that documented API call. Do not put the key in frontend code.

## Notes
- `backend/.env` and `frontend/.env.local` should not be committed.
- The sample knowledge is intentionally short. Add region-specific content verified against trusted agriculture sources before using this with farmers.
- This demo uses simple keyword intent detection, not a trained ML model.
