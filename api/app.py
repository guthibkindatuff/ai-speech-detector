from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse
from pydantic import BaseModel
from placeholder_classifier import PlaceholderClassifier
import os

app = FastAPI(title="AI Speech Detector API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve frontend static files for all non-API routes
@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    # If it's an API path, let it 404 (shouldn't reach here for valid API calls)
    if full_path.startswith("api/"):
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Not found")
    # Try to serve from public directory
    file_path = os.path.join(os.path.dirname(__file__), "public", full_path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    # Fall back to index.html for SPA routing
    index_path = os.path.join(os.path.dirname(__file__), "public", "index.html")
    if os.path.isfile(index_path):
        return FileResponse(index_path)
    return HTMLResponse("AI Speech Detector API - Please build the frontend", status_code=200)


@app.get("/health")
def health():
    return {"status": "healthy"}


classifier = PlaceholderClassifier()


class AnalyzeRequest(BaseModel):
    text: str


class Highlight(BaseModel):
    start: int
    end: int
    score: float
    reason: str


class AnalyzeResponse(BaseModel):
    confidence: int
    label: str
    highlights: list[Highlight]


def get_label_and_confidence(score: float) -> tuple[int, str]:
    """Convert AI probability score to label and confidence."""
    confidence = int(score * 100)

    if confidence >= 85:
        label = "Almost Certainly AI"
    elif confidence >= 60:
        label = "Likely AI"
    elif confidence >= 40:
        label = "Unclear"
    elif confidence >= 15:
        label = "Likely Human"
    else:
        label = "Almost Certainly Human"

    return confidence, label


@app.post("/api/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest):
    if not request.text.strip():
        return AnalyzeResponse(
            confidence=50,
            label="Unclear",
            highlights=[]
        )

    result = classifier.analyze(request.text)
    confidence, label = get_label_and_confidence(result["score"])

    return AnalyzeResponse(
        confidence=confidence,
        label=label,
        highlights=result["highlights"]
    )


@app.get("/api/health")
def api_health():
    return {"status": "healthy"}
