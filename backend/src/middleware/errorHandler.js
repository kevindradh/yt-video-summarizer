/**
 * Global Error Handler Middleware
 * Log format as per PRD 13.1: [TIMESTAMP] [LEVEL] [CODE] MESSAGE
 */
const errorHandler = (err, req, res, next) => {
  const timestamp = new Date().toISOString();
  const status = err.httpStatus || 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'Terjadi kesalahan internal pada server.';
  const level = status >= 500 ? 'ERROR' : 'WARN';

  // Formal Log Format (PRD 13.1)
  console.log(`[${timestamp}] [${level}] [${errorCode}] ${message}`);

  // Map specific error codes to suggestions as per PRD Section 5.2
  const suggestions = {
    'VIDEO_NOT_FOUND': 'Periksa kembali URL Anda atau pastikan video tidak dihapus.',
    'VIDEO_PRIVATE': 'Hanya video publik yang dapat diringkas.',
    'VIDEO_NO_TRANSCRIPT': 'Video ini tidak memiliki transkrip. Summarizer memerlukan caption.',
    'YOUTUBE_QUOTA_EXCEEDED': 'Layanan sedang sibuk. Coba lagi dalam beberapa menit.',
    'INVALID_URL': 'Masukkan URL YouTube yang valid.',
    'VIDEO_TOO_LONG': 'Video melebihi batas 2 jam untuk saat ini.',
    'GEO_RESTRICTED': 'Video ini tidak tersedia di wilayah Anda.',
    'AI_SERVICE_ERROR': status === 503 ? 'Layanan AI sedang sibuk karena permintaan tinggi. Silakan coba lagi sebentar lagi.' : 'Gagal memproses ringkasan. Coba video lain atau bahasa yang berbeda.',
  };

  res.status(status).json({
    success: false,
    error: {
      code: errorCode,
      httpStatus: status,
      message: message,
      suggestion: suggestions[errorCode] || 'Coba lagi nanti atau hubungi dukungan jika masalah berlanjut.',
      retryAfter: status === 429 || status >= 500 ? 60 : null, // Added retryAfter as per typical API standards
      retryable: status === 429 || status >= 500
    }
  });
};

module.exports = errorHandler;
