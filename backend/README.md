# API Documentation — YouTube Video Summarizer

**Base URL:** `http://localhost:3001`  
**Version:** 1.0.0

---

## 1. Summarize Video
Summarize a YouTube video using AI, provided its URL.

*   **Endpoint:** `POST /api/summarize`
*   **Content-Type:** `application/json`
*   **Rate Limit:** 100 requests per 15 minutes per IP.

### Request Body
| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `url` | string | Yes | - | Valid YouTube URL (standard, shorts, embed, youtu.be) |
| `outputLanguage` | string | No | `id` | `id` (Indonesian) or `en` (English) |
| `summaryLength` | string | No | `normal` | `short`, `normal`, or `detailed` |

**Example Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "outputLanguage": "id",
  "summaryLength": "normal"
}
```

### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "videoId": "dQw4w9WgXcQ",
    "title": "Rick Astley - Never Gonna Give You Up",
    "channel": "Rick Astley",
    "thumbnail": "https://i.ytimg.com/vi/...",
    "duration": 212,
    "summary": "AI generated summary text...",
    "keyPoints": [
      { "point": "First major point description" }
    ],
    "processedAt": "2026-04-27T10:00:00Z"
  }
}
```

### Error Responses
All errors follow this standard format:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "httpStatus": 4xx/5xx,
    "message": "Human readable error message",
    "suggestion": "Actionable advice for the user",
    "retryable": boolean
  }
}
```

| Code | Status | Description |
|---|---|---|
| `INVALID_INPUT` | 400 | Missing URL or invalid request schema. |
| `INVALID_URL` | 400 | URL provided is not a valid YouTube link. |
| `VIDEO_NOT_FOUND` | 404 | Video does not exist or has been deleted. |
| `VIDEO_PRIVATE` | 403 | Video is private and cannot be transcribed. |
| `VIDEO_TOO_LONG` | 422 | Video exceeds the 120-minute limit. |
| `VIDEO_NO_TRANSCRIPT` | 422 | No captions available for this video. |
| `AI_SERVICE_ERROR` | 502/503 | Issue connecting to Gemini API or high demand. |
| `TOO_MANY_REQUESTS` | 429 | Rate limit exceeded. |

---
*Reference: PRD-V1.0 technical specifications.*
