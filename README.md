# YouTube Video Summarizer

An AI-powered web application that generates structured summaries and key points from YouTube videos. Built with a modern full-stack architecture following strict engineering standards.

## 🚀 Features

- **Real-time Validation:** Instant feedback on YouTube URL formats.
- **Deep Analysis:** Fetches metadata and transcripts using YouTube Data API.
- **AI-Powered:** Uses Google Gemini 3.1 Flash to generate structured summaries.
- **Progress Tracking:** 4-stage loading visualization for better UX.
- **History:** Persistent storage of past summaries using `localStorage`.
- **Responsive Design:** Clean, modern UI built with Tailwind CSS.

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Zustand 5, Lucide Icons.
- **Backend:** Node.js, Express 5, Zod, Helmet, Express Rate Limit.
- **AI/API:** Google Gemini SDK (@google/genai), YouTube Data API.

## 📋 Prerequisites

- Node.js (v18 or higher)
- YouTube Data API Key
- Google Gemini API Key

## ⚙️ Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd web-summarizer-yt
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your API Keys
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

## 🛡️ Security & Performance

- **Rate Limiting:** Protected against abuse (100 req/15 min).
- **Security Headers:** Helmet.js integrated.
- **Validation:** Strict Zod schema validation for all inputs and environment variables.
- **Caching:** In-memory caching for 24h to optimize API costs.

---
Built as per PRD-V1.0 specifications.
