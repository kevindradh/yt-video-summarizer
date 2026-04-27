const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const env = require('./config/env');
const errorHandler = require('./middleware/errorHandler');
const summarizeRoutes = require('./routes/summarize');

const app = express();
const PORT = env.PORT;

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  methods: ['GET', 'POST'],
}));
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per window
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      httpStatus: 429,
      message: 'Terlalu banyak permintaan dari IP ini.',
      suggestion: 'Tunggu sekitar 15 menit sebelum mencoba kembali.',
      retryable: false
    }
  }
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', node_env: env.NODE_ENV });
});

// API Routes
app.use('/api/summarize', limiter, summarizeRoutes);

// Error Handling (Must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT} in ${env.NODE_ENV} mode`);
});
