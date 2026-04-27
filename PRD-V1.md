# PRD — YouTube Video Summarizer
**Version:** 1.0  
**Date:** April 2026  
**Platform:** Web App (React.js)  
**Status:** Draft — Internal Review  

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Tujuan Produk](#2-tujuan-produk)
3. [User Personas](#3-user-personas)
4. [Arsitektur Sistem & Alur Kerja](#4-arsitektur-sistem--alur-kerja)
5. [Spesifikasi Validasi & Penanganan Error](#5-spesifikasi-validasi--penanganan-error)
6. [Spesifikasi Fitur](#6-spesifikasi-fitur)
7. [Desain UX & State Management](#7-desain-ux--state-management)
8. [Keamanan & Rate Limiting](#8-keamanan--rate-limiting)
9. [Performa & Batasan Teknis](#9-performa--batasan-teknis)
10. [Rencana Pengembangan (Milestones)](#10-rencana-pengembangan-milestones)
11. [Testing & Quality Assurance](#11-testing--quality-assurance)
12. [Deployment & Infrastruktur](#12-deployment--infrastruktur)
13. [Risiko & Mitigasi](#13-risiko--mitigasi)
14. [Glosarium](#14-glosarium)

---

## 1. Executive Summary

YouTube Video Summarizer adalah aplikasi web berbasis **React.js** yang memungkinkan pengguna mendapatkan ringkasan cepat dan akurat dari konten video YouTube menggunakan kecerdasan buatan. Pengguna cukup memasukkan URL video YouTube, sistem akan mengekstrak transkrip, memprosesnya melalui AI, lalu menampilkan ringkasan terstruktur.

**Core value proposition:** Hemat waktu pengguna dengan menyajikan inti konten video tanpa perlu menontonnya secara penuh.

**Target users:** Pelajar, peneliti, content creator, dan profesional.

---

## 2. Tujuan Produk

### 2.1 Problem Statement
Pengguna sering menghadapi video YouTube yang sangat panjang (tutorial, kuliah, podcast, wawancara) namun tidak memiliki waktu untuk menontonnya secara keseluruhan. Tidak ada cara mudah untuk mendapatkan inti konten secara cepat tanpa membuka aplikasi pihak ketiga yang terpisah.

### 2.2 Goals
- Memungkinkan user mendapatkan ringkasan video YouTube dalam waktu kurang dari 30 detik (untuk video ≤ 30 menit).
- Mendukung video dalam berbagai bahasa dengan output ringkasan yang bisa dikonfigurasi (Indonesia / Inggris).
- Memberikan pengalaman pengguna yang bersih, responsif, dan intuitif.
- Menangani semua edge case dengan pesan error yang jelas dan actionable.

### 2.3 Non-Goals (Out of Scope untuk v1.0)
- ❌ Tidak men-download atau menyimpan video YouTube di server.
- ❌ Tidak mendukung platform video selain YouTube pada versi pertama.
- ❌ Tidak memerlukan akun atau login untuk fitur dasar.
- ❌ Tidak mendukung video livestream atau video yang sedang berlangsung.

---

## 3. User Personas

| Persona | Karakteristik | Kebutuhan Utama |
|---|---|---|
| Pelajar / Mahasiswa | Menonton kuliah, tutorial, dan webinar panjang | Ringkasan poin-poin kunci dan timeline |
| Peneliti / Akademisi | Mencari informasi spesifik dari video konferensi | Pencarian cepat + kutipan dengan timestamp |
| Content Creator | Riset konten kompetitor dan tren | Ringkasan singkat dan topik utama |
| Profesional Sibuk | Update berita, podcast bisnis | TL;DR — ringkasan 3 kalimat maksimal |

---

## 4. Arsitektur Sistem & Alur Kerja

### 4.1 Technology Stack

| Layer | Teknologi | Keterangan |
|---|---|---|
| Frontend | React.js + Vite | UI, state management, routing |
| State Management | Zustand / React Context | Global state: history, settings |
| Styling | Tailwind CSS | Responsive design, dark mode |
| Backend / API Layer | Node.js + Express **atau** Next.js API Routes | Proxy ke YouTube & AI API |
| Transcript Source | `youtube-transcript` npm / RapidAPI | Ambil transkrip/caption video |
| AI Summarization | OpenAI GPT-4o **atau** Claude API | Proses teks menjadi ringkasan |
| Caching | Redis (prod) / node-cache (dev) | Cache hasil untuk URL yang sama |
| Rate Limiting | `express-rate-limit` | Lindungi API endpoint |
| HTTP Client | Axios + interceptors | Request frontend ke backend |

### 4.2 Struktur Direktori Proyek

```
youtube-summarizer/
├── frontend/                  # React.js App
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx         # Halaman utama + input form
│   │   │   ├── ResultPage.jsx       # Halaman hasil ringkasan
│   │   │   └── HistoryPage.jsx      # Riwayat ringkasan
│   │   ├── components/
│   │   │   ├── UrlInput.jsx         # Input field + validasi real-time
│   │   │   ├── SummaryCard.jsx      # Kartu ringkasan utama
│   │   │   ├── VideoMeta.jsx        # Thumbnail, judul, durasi, channel
│   │   │   ├── KeyPoints.jsx        # Daftar poin kunci + timestamp
│   │   │   ├── LoadingState.jsx     # Skeleton + progress steps
│   │   │   ├── ErrorAlert.jsx       # Error display + saran perbaikan
│   │   │   └── OptionPanel.jsx      # Bahasa output, panjang ringkasan
│   │   ├── hooks/
│   │   │   ├── useSummarize.js      # Custom hook: API call + state
│   │   │   └── useHistory.js        # Custom hook: localStorage history
│   │   ├── utils/
│   │   │   ├── urlValidator.js      # Validasi & parsing URL YouTube
│   │   │   └── apiClient.js         # Axios instance + interceptors
│   │   ├── store/
│   │   │   └── appStore.js          # Zustand global store
│   │   └── App.jsx
│   └── index.html
│
├── backend/                   # Node.js + Express
│   ├── src/
│   │   ├── routes/
│   │   │   └── summarize.js         # POST /api/summarize
│   │   ├── services/
│   │   │   ├── youtubeService.js    # Ambil metadata + transkrip
│   │   │   ├── aiService.js         # Kirim ke AI API
│   │   │   ├── chunkService.js      # Chunking transkrip panjang
│   │   │   └── cacheService.js      # Redis / in-memory cache
│   │   ├── middleware/
│   │   │   ├── rateLimiter.js       # Express rate limiting
│   │   │   ├── errorHandler.js      # Global error handler
│   │   │   └── validateRequest.js   # Input sanitization
│   │   └── app.js
│   └── .env.example
│
└── README.md
```

### 4.3 Alur Sistem End-to-End

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER FLOW                                   │
└─────────────────────────────────────────────────────────────────────┘

[USER INPUT]
    │
    ▼
┌─────────────────────────────────────┐
│  FASE 1: Validasi Frontend          │
│  • Check: input tidak kosong        │
│  • Check: format URL valid          │
│  • Check: domain YouTube            │
│  • Check: ada video ID              │
│  • Jika invalid → tampilkan error   │
└─────────────────┬───────────────────┘
                  │ POST /api/summarize
                  ▼
┌─────────────────────────────────────┐
│  FASE 2: Backend Processing         │
│                                     │
│  2a. Validasi server-side URL       │
│  2b. Check cache (Redis)            │
│       ├─ HIT  → return cached       │
│       └─ MISS → lanjut proses       │
│  2c. Fetch metadata YouTube API     │
│       ├─ video tidak ada → 404      │
│       ├─ video private  → 403       │
│       └─ dapat metadata → lanjut    │
│  2d. Cek durasi video               │
│       ├─ < 1 mnt  → warning         │
│       ├─ 1-120mnt → proses normal   │
│       └─ > 120mnt → block / segment │
│  2e. Fetch transkrip/caption        │
│       ├─ tidak ada → 422            │
│       └─ ada → lanjut               │
│  2f. Bersihkan & normalisasi teks   │
│  2g. Chunking (jika > 3000 token)   │
│  2h. Kirim ke AI API                │
│  2i. Format response JSON           │
│  2j. Simpan ke cache                │
└─────────────────┬───────────────────┘
                  │ JSON Response
                  ▼
┌─────────────────────────────────────┐
│  FASE 3: Render Hasil di Frontend   │
│  • Tampilkan metadata video         │
│  • Render ringkasan utama           │
│  • Render daftar key points         │
│  • Tampilkan timestamp links        │
│  • Aktifkan tombol Copy/Share/Save  │
└─────────────────────────────────────┘
```

### 4.4 Format JSON Response (Kontrak API)

```json
{
  "success": true,
  "data": {
    "videoId": "dQw4w9WgXcQ",
    "title": "Judul Video YouTube",
    "channel": "Nama Channel",
    "duration": 213,
    "durationLabel": "3:33",
    "language": "id",
    "thumbnail": "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    "publishedAt": "2023-10-15T00:00:00Z",
    "summary": "Teks ringkasan 150-300 kata...",
    "keyPoints": [
      { "point": "Deskripsi poin pertama", "timestamp": 45, "timestampLabel": "0:45" },
      { "point": "Deskripsi poin kedua", "timestamp": 120, "timestampLabel": "2:00" }
    ],
    "summaryLength": "normal",
    "outputLanguage": "id",
    "processedAt": "2026-04-27T10:30:00Z",
    "cached": false,
    "processingTimeMs": 8420
  }
}
```

**Error response format:**

```json
{
  "success": false,
  "error": {
    "code": "VIDEO_NO_TRANSCRIPT",
    "httpStatus": 422,
    "message": "Video ini tidak memiliki transkrip yang dapat diproses.",
    "suggestion": "Coba video lain yang memiliki subtitle/caption.",
    "retryable": false
  }
}
```

---

## 5. Spesifikasi Validasi & Penanganan Error

### 5.1 Validasi Layer 1 — Frontend (Pre-request)

Implementasi di `utils/urlValidator.js`:

```js
// Regex pattern untuk semua format URL YouTube yang valid
const YOUTUBE_URL_REGEX = /^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

function validateYouTubeUrl(input) {
  if (!input || input.trim() === '') {
    return { valid: false, error: 'INPUT_EMPTY' };
  }
  if (!input.startsWith('http://') && !input.startsWith('https://')) {
    // Cek apakah mungkin query string, bukan URL
    if (!input.includes('.')) {
      return { valid: false, error: 'NOT_A_URL' };
    }
  }
  if (!input.includes('youtube.com') && !input.includes('youtu.be')) {
    return { valid: false, error: 'NOT_YOUTUBE' };
  }
  const match = input.match(YOUTUBE_URL_REGEX);
  if (!match) {
    return { valid: false, error: 'NO_VIDEO_ID' };
  }
  return { valid: true, videoId: match[5] };
}
```

**Tabel pesan error frontend:**

| Kode Error | Contoh Input | Pesan ke User |
|---|---|---|
| `INPUT_EMPTY` | *(klik tombol kosong)* | "Masukkan URL YouTube terlebih dahulu." |
| `NOT_A_URL` | `"tutorial react js"` | "Input bukan URL. Contoh: `https://youtube.com/watch?v=xxxxx`" |
| `NOT_YOUTUBE` | `"https://vimeo.com/123"` | "Hanya URL YouTube yang didukung saat ini." |
| `NO_VIDEO_ID` | `"https://youtube.com/channel/abc"` | "URL tidak mengarah ke video. Pastikan URL mengandung `?v=` atau berbentuk `youtu.be/xxxxx`" |
| `INVALID_ID_FORMAT` | `"https://youtube.com/watch?v=!@#$%"` | "Format ID video tidak valid. Periksa kembali URL Anda." |

**Format URL YouTube yang diterima:**

```
✅ https://youtube.com/watch?v={VIDEO_ID}
✅ https://www.youtube.com/watch?v={VIDEO_ID}&t=123s
✅ https://youtu.be/{VIDEO_ID}
✅ https://youtube.com/shorts/{VIDEO_ID}
✅ https://m.youtube.com/watch?v={VIDEO_ID}
✅ https://youtube.com/embed/{VIDEO_ID}

❌ https://youtube.com/channel/UCxxxxx
❌ https://youtube.com/playlist?list=xxxxx
❌ https://youtube.com/@username
```

---

### 5.2 Validasi Layer 2 — Backend (Server-side)

Implementasi di `middleware/validateRequest.js` dan `services/youtubeService.js`:

| Skenario | HTTP Status | Kode Error | Pesan ke User |
|---|---|---|---|
| Video tidak ditemukan | 404 | `VIDEO_NOT_FOUND` | "Video tidak ditemukan atau sudah dihapus." |
| Video private | 403 | `VIDEO_PRIVATE` | "Video bersifat private dan tidak dapat diakses." |
| Video unlisted | 200 | *(proses normal)* | *(tidak ada pesan khusus, unlisted bisa diakses)* |
| Video tanpa caption | 422 | `VIDEO_NO_TRANSCRIPT` | "Video ini tidak memiliki transkrip. Summarizer memerlukan caption." |
| Caption auto-generated noise | 422 | `TRANSCRIPT_LOW_QUALITY` | "Transkrip tidak dapat diproses. Video mungkin berisi musik atau tidak ada percakapan." |
| Konten geo-restricted | 451 | `GEO_RESTRICTED` | "Konten tidak tersedia di wilayah server." |
| Video age-restricted | 403 | `AGE_RESTRICTED` | "Video memiliki pembatasan usia dan tidak dapat diproses." |
| YouTube API quota habis | 429 | `YOUTUBE_QUOTA_EXCEEDED` | "Layanan sedang sibuk. Coba lagi dalam beberapa menit." |

---

### 5.3 Validasi Durasi Video

> ⚠️ **Ini adalah salah satu validasi paling penting** karena langsung mempengaruhi panjang transkrip, biaya AI API, dan waktu proses.

| Durasi | Kategori | Tindakan Sistem | Pesan ke User |
|---|---|---|---|
| 0 — 60 detik | Terlalu Pendek | Proses tanpa chunking, tambahkan `warning` flag | "Video sangat singkat. Ringkasan mungkin tidak jauh berbeda dari konten aslinya." |
| 1 — 30 menit | **Ideal** | Proses penuh, satu request ke AI | *(tidak ada pesan khusus)* |
| 30 — 60 menit | Panjang | Chunking transkrip, proses bertahap | "Video cukup panjang. Proses mungkin memakan waktu hingga 45 detik." |
| 60 — 120 menit | Sangat Panjang | Chunking + intermediate summary, tampilkan progress step | "Video 1-2 jam sedang diproses. Estimasi waktu: 1-2 menit. Mohon tunggu." |
| > 120 menit | **Melebihi Batas** | Blokir dan tawarkan segmentasi | "Video melebihi batas 2 jam. Gunakan fitur **Ringkasan Segmen** untuk memproses bagian tertentu." |

**Teknis chunking untuk video panjang:**

```
ALGORITMA CHUNKING:
1. Hitung total token dari transkrip (estimasi: 1 kata ≈ 1.3 token)
2. Jika total_token > CHUNK_SIZE (3000 token):
   a. Bagi transkrip menjadi N chunk masing-masing ~3000 token
   b. Setiap chunk diproses AI dengan prompt: "Ringkas bagian ini secara singkat"
   c. Kirim semua chunk secara PARALEL (Promise.all)
   d. Gabungkan hasil chunk
   e. Proses gabungan dengan prompt: "Buat ringkasan final dari ringkasan-ringkasan ini"
3. Kirim progress ke frontend setiap chunk selesai (via SSE atau polling)
```

---

### 5.4 Validasi Konten & Bahasa

| Skenario | Deteksi | Penanganan |
|---|---|---|
| Bahasa tidak dikenali AI | Deteksi via `franc` npm library | Coba terjemahkan via API sebelum summarize; jika gagal return `LANGUAGE_UNSUPPORTED` |
| Konten campuran bahasa | Mix Indonesia-Inggris | Proses apa adanya, tambahkan note di response |
| Transkrip terlalu pendek (< 100 kata) | Count word setelah cleaning | Proses tanpa AI, return teks asli dengan flag `TOO_SHORT_FOR_SUMMARY` |
| Konten terdeteksi berbahaya | AI content filter | Return 422 `CONTENT_POLICY_VIOLATION`: "Konten tidak dapat diproses karena kebijakan penggunaan." |

---

### 5.5 Validasi Error Jaringan & Infrastruktur

| Jenis Error | Trigger | Respons Sistem |
|---|---|---|
| Request Timeout | AI API tidak merespons > 30 detik | Retry otomatis 1x dengan exponential backoff, lalu return `PROCESSING_TIMEOUT` dengan tombol "Coba Lagi" |
| Koneksi User Terputus | `navigator.onLine === false` | Tampilkan banner offline, disable tombol summarize, auto-retry saat online kembali |
| Server Error 500 | Backend crash / unhandled exception | Tampilkan pesan generik, log ke Sentry, jangan expose stack trace ke frontend |
| AI API Error | Token limit exceeded, model overload | Fallback ke model lebih kecil jika tersedia, atau return `AI_SERVICE_UNAVAILABLE` |
| Rate Limit Tercapai | > 10 request/menit dari satu IP | Return 429 dengan header `Retry-After`, tampilkan countdown timer di UI |
| Cache Write Error | Redis down | Lanjutkan tanpa cache (graceful degradation), log warning |

---

## 6. Spesifikasi Fitur

### 6.1 Fitur Inti — MVP (v1.0)

| Fitur | Deskripsi | Priority |
|---|---|---|
| Input URL | Input field dengan validasi real-time, contoh URL sebagai placeholder | P0 |
| Auto Summarize | Ringkasan teks 150-300 kata | P0 |
| Key Points | Daftar 5-10 poin penting dari video | P0 |
| Video Metadata | Tampilkan judul, thumbnail, channel, durasi, tanggal upload | P0 |
| Pilihan Bahasa Output | Toggle Indonesia / English | P1 |
| Pilihan Panjang Ringkasan | Singkat (~100 kata) / Normal (~200 kata) / Detail (~400 kata) | P1 |
| Copy to Clipboard | Salin ringkasan dengan satu klik | P1 |
| Error Handling | Semua kasus error dengan pesan + saran perbaikan | P0 |
| Loading States | Progress step-by-step saat proses berlangsung | P0 |
| Responsive Design | Support mobile, tablet, dan desktop | P1 |

### 6.2 Fitur Tambahan — Post-MVP (v1.1+)

| Fitur | Deskripsi | Priority |
|---|---|---|
| Riwayat Ringkasan | Simpan hasil ke localStorage, tampilkan di halaman History | P2 |
| Export ke PDF / Markdown | Download ringkasan sebagai file | P2 |
| Timestamp Links | Klik poin kunci untuk lompat ke momen video di YouTube | P2 |
| Ringkasan Segmen | Pilih range waktu tertentu dari video panjang | P2 |
| Dark Mode | Toggle tema gelap | P3 |
| Share Link | Buat URL pendek yang bisa dishare berisi ringkasan | P3 |
| Browser Extension | Tombol summarize langsung di halaman YouTube | P4 |

---

### 6.3 Konfigurasi Prompt AI

```
SYSTEM PROMPT (untuk AI API):
"Kamu adalah asisten yang bertugas meringkas konten video YouTube 
berdasarkan transkrip yang diberikan. Tugas kamu:
1. Buat ringkasan yang jelas dan terstruktur dalam bahasa {outputLanguage}.
2. Identifikasi {keyPointCount} poin utama paling penting.
3. Untuk setiap poin, sertakan estimasi timestamp jika memungkinkan.
4. Panjang ringkasan: {summaryLengthInstruction}.
5. Jangan menyebutkan bahwa kamu membaca transkrip; tulis seolah kamu menonton video.
6. Jika konten tidak jelas atau tidak berkoherensi, katakan dengan jujur."

USER PROMPT:
"Transkrip video berjudul '{videoTitle}':
{transcriptChunk}
---
Buat ringkasan dan key points sesuai instruksi."
```

---

## 7. Desain UX & State Management

### 7.1 Halaman Utama (`HomePage.jsx`)

```
┌─────────────────────────────────────────────────────┐
│  🎬  YouTube Summarizer                    [History] │
├─────────────────────────────────────────────────────┤
│                                                     │
│        Ringkas Video YouTube dalam Detik            │
│        Paste URL • Dapatkan Inti Konten             │
│                                                     │
│  ┌─────────────────────────────────────┐  [Ringkas] │
│  │ https://youtube.com/watch?v=...     │           │
│  └─────────────────────────────────────┘           │
│                                                     │
│  Bahasa Output: [🇮🇩 Indonesia] [🇺🇸 English]        │
│  Panjang:       [Singkat] [Normal ✓] [Detail]       │
│                                                     │
│  ─────── Cara Kerja ───────                         │
│  [1. Paste URL] → [2. AI Proses] → [3. Baca]       │
└─────────────────────────────────────────────────────┘
```

### 7.2 Loading States (Progress Steps)

Implementasi di `LoadingState.jsx` dengan tahapan bertingkat:

```js
const LOADING_STEPS = [
  { id: 'validating',    label: 'Memeriksa URL...',             duration: '~1 detik'  },
  { id: 'fetching',      label: 'Mengambil data video...',      duration: '~2 detik'  },
  { id: 'transcribing',  label: 'Membaca transkrip video...',   duration: '~3 detik'  },
  { id: 'processing',    label: 'AI sedang meringkas...',       duration: '~10 detik' },
  { id: 'chunking',      label: 'Memproses bagian {n} dari {total}...', duration: 'per chunk' },
];
```

### 7.3 State Management (Zustand Store)

```js
// store/appStore.js
const useAppStore = create((set) => ({
  // Input state
  inputUrl: '',
  options: {
    outputLanguage: 'id',   // 'id' | 'en'
    summaryLength: 'normal', // 'short' | 'normal' | 'detailed'
  },

  // Process state
  status: 'idle', // 'idle' | 'loading' | 'success' | 'error'
  currentStep: null,
  progress: 0,    // 0-100 untuk video panjang

  // Result state
  result: null,   // SummaryResponse object
  error: null,    // ErrorResponse object

  // History state
  history: [],    // Array of past SummaryResponse

  // Actions
  setInputUrl: (url) => set({ inputUrl: url }),
  setOptions: (opts) => set((s) => ({ options: { ...s.options, ...opts } })),
  setStatus: (status) => set({ status }),
  setResult: (result) => set({ result, status: 'success' }),
  setError: (error) => set({ error, status: 'error' }),
  addToHistory: (result) => set((s) => ({ history: [result, ...s.history].slice(0, 20) })),
  reset: () => set({ status: 'idle', result: null, error: null, progress: 0 }),
}));
```

### 7.4 Custom Hook `useSummarize`

```js
// hooks/useSummarize.js
function useSummarize() {
  const { setStatus, setResult, setError, setCurrentStep, options } = useAppStore();

  const summarize = async (url) => {
    setStatus('loading');
    setCurrentStep('validating');

    try {
      const response = await apiClient.post('/api/summarize', {
        url,
        outputLanguage: options.outputLanguage,
        summaryLength: options.summaryLength,
      });

      setResult(response.data.data);
      addToHistory(response.data.data);
    } catch (err) {
      const errorData = err.response?.data?.error || {
        code: 'UNKNOWN_ERROR',
        message: 'Terjadi kesalahan tidak terduga.',
        retryable: true,
      };
      setError(errorData);
    }
  };

  return { summarize };
}
```

---

## 8. Keamanan & Rate Limiting

### 8.1 Prinsip Keamanan

- **API Keys** — Semua key (YouTube API, OpenAI/Claude) hanya di `backend/.env`. **Tidak pernah** di frontend atau di-commit ke repo.
- **CORS** — Konfigurasi strict, hanya izinkan origin domain resmi aplikasi.
- **Input Sanitization** — Sanitasi semua input URL di backend sebelum diproses menggunakan `DOMPurify` atau `validator.js`.
- **Error Exposure** — Jangan pernah kirim stack trace atau pesan error teknis ke frontend. Selalu gunakan pesan yang sudah didefinisikan.
- **HTTPS** — Wajib untuk semua komunikasi di production.
- **Dependency Audit** — Jalankan `npm audit` secara berkala. Set up Dependabot di GitHub.

### 8.2 Rate Limiting Configuration

```js
// middleware/rateLimiter.js
import rateLimit from 'express-rate-limit';

export const summarizeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 menit
  max: 10,                  // max 10 request per IP per menit
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      httpStatus: 429,
      message: 'Terlalu banyak permintaan. Coba lagi dalam 1 menit.',
      retryable: true,
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const globalLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 jam
  max: 100,                  // max 100 request per IP per jam
});
```

### 8.3 Environment Variables

```bash
# backend/.env.example
PORT=3001
NODE_ENV=development

# YouTube
YOUTUBE_API_KEY=your_youtube_data_api_v3_key

# AI
OPENAI_API_KEY=your_openai_api_key
# atau
ANTHROPIC_API_KEY=your_anthropic_api_key
AI_PROVIDER=openai   # 'openai' | 'anthropic'
AI_MODEL=gpt-4o      # 'gpt-4o' | 'claude-sonnet-4-20250514'

# Cache
REDIS_URL=redis://localhost:6379
CACHE_TTL_SECONDS=86400   # 24 jam

# Limits
MAX_VIDEO_DURATION_SECONDS=7200   # 2 jam
CHUNK_SIZE_TOKENS=3000
MAX_TOKENS_PER_REQUEST=4000

# Frontend URL (untuk CORS)
FRONTEND_URL=http://localhost:5173
```

---

## 9. Performa & Batasan Teknis

### 9.1 Performance Targets

| Metrik | Target | Catatan |
|---|---|---|
| Time to Summary (video ≤ 30 mnt) | < 15 detik | P95 |
| Time to Summary (video 30-60 mnt) | < 45 detik | Dengan chunking paralel |
| Time to Summary (video 60-120 mnt) | < 120 detik | Dengan chunking + intermediate summary |
| Frontend Initial Load (FCP) | < 2 detik | Lighthouse score ≥ 90 |
| Frontend Bundle Size | < 500 KB | Gzip compressed |
| Cache Hit Rate | > 40% | Untuk URL populer |
| API Error Rate | < 2% | Dimonitor via Sentry |
| Uptime | > 99% | Prod environment |

### 9.2 Batasan Teknis

| Batasan | Nilai | Alasan |
|---|---|---|
| Maksimum durasi video | 120 menit | Batas token AI dan waktu proses |
| Minimum durasi video | Tidak ada batas keras | Warning diberikan untuk < 1 menit |
| Bahasa transkrip | Semua bahasa yang didukung YouTube | AI akan handle translasi jika perlu |
| Format URL yang diterima | Lihat Seksi 5.1 | Hanya youtube.com dan youtu.be |
| Request timeout | 30 detik | Untuk request ke AI API |
| Max concurrent users | ~100 (free tier infra) | Scale sesuai kebutuhan |

---

## 10. Rencana Pengembangan (Milestones)

| Sprint | Minggu | Deliverable |
|---|---|---|
| Sprint 1 | 1-2 | Setup project (Vite + React + Tailwind + Express), komponen `UrlInput`, validasi frontend lengkap, unit test `urlValidator` |
| Sprint 2 | 3-4 | Backend Express, integrasi YouTube Transcript API, endpoint `POST /api/summarize` (tanpa AI dulu), error handling Layer 2 |
| Sprint 3 | 5-6 | Integrasi AI API, chunking service untuk video panjang, Redis caching, rate limiting |
| Sprint 4 | 7-8 | UI `ResultPage` + `SummaryCard`, semua loading states, `ErrorAlert`, integrasi frontend-backend penuh |
| Sprint 5 | 9-10 | Fitur tambahan: riwayat localStorage, export Markdown/PDF, dark mode, opsi bahasa & panjang ringkasan |
| Sprint 6 | 11-12 | Unit test + E2E test (Playwright), performance audit, deployment Vercel + Railway, monitoring setup |

---

## 11. Testing & Quality Assurance

### 11.1 Unit Tests (`urlValidator.js`)

Minimal 20 test case yang harus lolos:

```js
// Test cases yang HARUS valid:
✅ 'https://youtube.com/watch?v=dQw4w9WgXcQ'
✅ 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
✅ 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s'
✅ 'https://youtu.be/dQw4w9WgXcQ'
✅ 'https://youtu.be/dQw4w9WgXcQ?t=30'
✅ 'https://youtube.com/shorts/dQw4w9WgXcQ'
✅ 'https://m.youtube.com/watch?v=dQw4w9WgXcQ'
✅ 'https://youtube.com/embed/dQw4w9WgXcQ'

// Test cases yang HARUS invalid:
❌ ''                                           → INPUT_EMPTY
❌ 'tutorial react js'                          → NOT_A_URL
❌ 'https://vimeo.com/123456'                   → NOT_YOUTUBE
❌ 'https://youtube.com/'                       → NO_VIDEO_ID
❌ 'https://youtube.com/channel/UCxxxxx'        → NO_VIDEO_ID
❌ 'https://youtube.com/watch?v=short'          → INVALID_ID_FORMAT (< 11 char)
❌ 'https://youtube.com/watch?v=toolongid123'   → INVALID_ID_FORMAT (> 11 char)
❌ 'https://youtube.com/watch?v=!@#$%^&*('     → INVALID_ID_FORMAT
❌ 'https://youtube.com/playlist?list=PLxxxxx'  → NO_VIDEO_ID
```

### 11.2 Integration Tests (Backend)

Setiap endpoint harus ditest dengan:

```
POST /api/summarize
├── ✅ Video valid 5 menit → 200 + summary
├── ✅ Video valid 45 menit → 200 + summary + warning "video panjang"
├── ✅ URL yang sama (kedua kali) → 200 + `cached: true`
├── ❌ Video tidak ditemukan → 404 VIDEO_NOT_FOUND
├── ❌ Video private → 403 VIDEO_PRIVATE
├── ❌ Video tanpa caption → 422 VIDEO_NO_TRANSCRIPT
├── ❌ Video > 2 jam → 422 VIDEO_TOO_LONG
├── ❌ URL bukan YouTube → 400 INVALID_URL
├── ❌ > 10 request/menit → 429 RATE_LIMIT_EXCEEDED
└── ❌ Body kosong → 400 MISSING_URL
```

### 11.3 E2E Tests (Playwright)

```js
// Happy path
test('user dapat summarize video YouTube yang valid', async ({ page }) => {
  await page.goto('/');
  await page.fill('[data-testid="url-input"]', 'https://youtube.com/watch?v=dQw4w9WgXcQ');
  await page.click('[data-testid="summarize-button"]');
  await expect(page.locator('[data-testid="loading-state"]')).toBeVisible();
  await expect(page.locator('[data-testid="summary-card"]')).toBeVisible({ timeout: 30000 });
  await expect(page.locator('[data-testid="key-points"]')).toBeVisible();
});

// Error path
test('tampilkan error yang tepat untuk video private', async ({ page }) => {
  // ... mock API response dengan VIDEO_PRIVATE error
  await expect(page.locator('[data-testid="error-alert"]')).toContainText('bersifat private');
});
```

### 11.4 Checklist QA Sebelum Deploy

- [ ] Semua unit test lulus (`npm test`)
- [ ] Semua E2E test lulus (`npm run test:e2e`)
- [ ] Lighthouse score ≥ 90 (Performance, Accessibility, Best Practices)
- [ ] Tidak ada API key yang ter-expose di frontend bundle (check via DevTools)
- [ ] Rate limiting berfungsi (test manual dengan burst request)
- [ ] Error handling semua skenario di Seksi 5 sudah ditest secara manual
- [ ] Responsive design ditest di mobile, tablet, desktop
- [ ] Dark mode berfungsi tanpa glitch

---

## 12. Deployment & Infrastruktur

### 12.1 Rekomendasi Stack Deployment

```
Frontend (React) ──→ Vercel
                      • Auto-deploy dari GitHub main branch
                      • Preview URL untuk setiap PR
                      • Environment variables via Vercel dashboard

Backend (Express) ──→ Railway atau Render
                       • Auto-deploy dari GitHub
                       • Managed Redis tersedia
                       • Environment variables via dashboard

Database/Cache ──→ Redis Cloud (free tier untuk dev)
                   Upstash Redis (serverless, cocok untuk Vercel)

Monitoring ──→ Sentry (error tracking)
               Uptime Robot (availability monitoring)
               Vercel Analytics (Web Vitals)
```

### 12.2 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm test
      - run: npm run test:e2e

  deploy-frontend:
    needs: test
    # Deploy ke Vercel via Vercel GitHub integration

  deploy-backend:
    needs: test
    # Deploy ke Railway via Railway GitHub integration
```

---

## 13. Risiko & Mitigasi

| Risiko | Probabilitas | Dampak | Mitigasi |
|---|---|---|---|
| YouTube memblokir akses transcript API | Sedang | Tinggi | Siapkan 2 library alternatif (`youtube-transcript`, `ytdl-core`); monitor breaking changes; pertimbangkan YouTube Data API v3 sebagai fallback |
| Biaya AI API membengkak | Tinggi | Tinggi | Cache agresif (TTL 24 jam), batas token per request, quota harian per user, monitoring biaya real-time |
| Video sangat panjang menyebabkan timeout | Sedang | Sedang | Chunking paralel + streaming response via SSE; background job queue untuk video > 60 menit |
| Kualitas ringkasan buruk untuk topik niche | Sedang | Rendah | Prompt engineering iteratif, system prompt yang lebih spesifik, minta feedback user (thumbs up/down) |
| Perubahan kebijakan YouTube Terms of Service | Rendah | Tinggi | Review ToS secara berkala; pastikan app tidak melanggar ToS (tidak store video, hanya akses caption publik) |
| Model AI deprecated / API berubah | Rendah | Sedang | Abstraksi `aiService.js` yang memudahkan switch model; pantau changelog provider AI |

---

## 14. Glosarium

| Istilah | Definisi |
|---|---|
| **Transcript** | Teks yang merepresentasikan audio/percakapan dalam video (subtitle/caption) |
| **Chunking** | Teknik memecah teks panjang menjadi potongan lebih kecil agar masuk dalam batas token AI |
| **Token** | Satuan pemrosesan teks oleh model AI; 1 token ≈ 4 karakter / 0.75 kata |
| **Cache Hit** | Kondisi di mana hasil yang diminta sudah tersimpan di cache, tidak perlu proses ulang |
| **Rate Limiting** | Pembatasan jumlah request ke server dalam periode waktu tertentu |
| **Video ID** | Kode unik 11 karakter yang mengidentifikasi setiap video di YouTube (contoh: `dQw4w9WgXcQ`) |
| **SSE** | Server-Sent Events — mekanisme server push untuk streaming progress ke frontend |
| **P0/P1/P2** | Prioritas fitur: P0 = must have, P1 = should have, P2 = nice to have |
| **Edge Case** | Kondisi input atau situasi ekstrem yang jarang terjadi namun harus ditangani |
| **Graceful Degradation** | Sistem tetap berfungsi (meskipun terbatas) saat salah satu komponen gagal |

---

> **Catatan:** Dokumen ini adalah *living document*. Setiap perubahan signifikan pada spesifikasi harus didiskusikan dan disetujui sebelum implementasi. Versi terbaru selalu tersedia di repository proyek.
>
> **Untuk AI Agent:** Gunakan dokumen ini sebagai referensi utama saat mengerjakan task. Jika ada ambiguitas pada spesifikasi, prioritaskan Seksi 5 (Validasi & Error Handling) dan Seksi 4.4 (Kontrak API JSON) sebagai sumber kebenaran teknis.