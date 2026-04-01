import json
from models.placeholder_classifier import PlaceholderClassifier

classifier = PlaceholderClassifier()


def get_label_and_confidence(score: float) -> tuple:
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


def handler(request, context):
    """Vercel Python serverless handler for /api/analyze."""
    if request.method != "POST":
        return {
            "statusCode": 405,
            "body": json.dumps({"error": "Method not allowed"})
        }

    try:
        body = json.loads(request.body) if request.body else {}
        text = body.get("text", "")
    except json.JSONDecodeError:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Invalid JSON"})
        }

    if not text.strip():
        return {
            "statusCode": 200,
            "body": json.dumps({
                "confidence": 50,
                "label": "Unclear",
                "highlights": []
            })
        }

    result = classifier.analyze(text)
    confidence, label = get_label_and_confidence(result["score"])

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({
            "confidence": confidence,
            "label": label,
            "highlights": result["highlights"]
        })
    }
