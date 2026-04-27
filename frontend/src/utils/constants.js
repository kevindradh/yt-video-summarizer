export const APP_CONFIG = {
  BASE_URL: 'http://localhost:3001',
  MAX_VIDEO_DURATION_SECONDS: 7200, // 2 Hours
  HISTORY_LIMIT: 20,
};

export const ERROR_MESSAGES = {
  INPUT_EMPTY: 'Masukkan URL YouTube terlebih dahulu.',
  NOT_A_URL: 'Input bukan URL. Contoh: https://youtube.com/watch?v=xxxxx',
  NOT_YOUTUBE: 'Hanya URL YouTube yang didukung saat ini.',
  NO_VIDEO_ID: 'URL tidak mengarah ke video. Pastikan URL mengandung ?v= atau berbentuk youtu.be/xxxxx',
  INVALID_ID_FORMAT: 'Format ID video tidak valid. Periksa kembali URL Anda.',
  UNKNOWN_ERROR: 'Terjadi kesalahan tidak terduga.',
};

export const LOADING_STEPS = [
  { id: 'validating',    label: 'Memeriksa URL...' },
  { id: 'fetching',      label: 'Mengambil data video...' },
  { id: 'transcribing',  label: 'Membaca transkrip video...' },
  { id: 'processing',    label: 'AI sedang meringkas...' },
];

export const THEME_MODES = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'system', label: 'Auto' },
];
