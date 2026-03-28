from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from models.placeholder_classifier import PlaceholderClassifier

app = FastAPI(title="AI Speech Detector API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    # score is probability of being AI-generated (0=human, 1=AI)
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


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/analyze", response_model=AnalyzeResponse)
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
