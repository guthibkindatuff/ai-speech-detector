import json


def handler(request, context):
    """Vercel Python serverless handler for /api/health."""
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"status": "healthy"})
    }
