/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('[Error]:', err);

  const status = err.httpStatus || 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'Terjadi kesalahan internal pada server.';
  
  // Map specific error codes to suggestions as per PRD Section 5.2
  const suggestions = {
    'VIDEO_NOT_FOUND': 'Periksa kembali URL Anda atau pastikan video tidak dihapus.',
    'VIDEO_PRIVATE': 'Hanya video publik yang dapat diringkas.',
    'VIDEO_NO_TRANSCRIPT': 'Video ini tidak memiliki transkrip. Summarizer memerlukan caption.',
    'YOUTUBE_QUOTA_EXCEEDED': 'Layanan sedang sibuk. Coba lagi dalam beberapa menit.',
    'INVALID_URL': 'Masukkan URL YouTube yang valid.',
    'VIDEO_TOO_LONG': 'Video melebihi batas 2 jam untuk saat ini.',
    'AI_SERVICE_ERROR': status === 503 ? 'Layanan AI sedang sibuk karena permintaan tinggi. Silakan coba lagi sebentar lagi.' : 'Gagal memproses ringkasan. Coba video lain atau bahasa yang berbeda.',
  };

  res.status(status).json({
    success: false,
    error: {
      code: errorCode,
      httpStatus: status,
      message: message,
      suggestion: suggestions[errorCode] || 'Coba lagi nanti atau hubungi dukungan jika masalah berlanjut.',
      retryable: status === 429 || status >= 500
    }
  });
};

module.exports = errorHandler;
