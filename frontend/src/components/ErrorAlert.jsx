import { useAppStore } from '../store/appStore';
import { RefreshCw, XCircle } from 'lucide-react';

const ErrorAlert = ({ onRetry }) => {
  const error = useAppStore((s) => s.error);
  const reset = useAppStore((s) => s.reset);

  if (!error) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-start space-x-4 text-left">
        <div className="flex-shrink-0">
          <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-red-900 dark:text-red-300">
            Terjadi Kesalahan
          </h3>
          <p className="mt-1 text-red-700 dark:text-red-400 text-sm">
            {error.message || 'Gagal memproses permintaan Anda.'}
          </p>
          
          {error.suggestion && (
            <div className="mt-4 p-3 bg-white/50 dark:bg-black/20 rounded-lg">
              <p className="text-xs font-semibold text-red-800 dark:text-red-300 uppercase tracking-wider mb-1">
                Saran:
              </p>
              <p className="text-sm text-red-700 dark:text-red-400">
                {error.suggestion}
              </p>
            </div>
          )}

          <div className="mt-6 flex space-x-3">
            {error.retryable && (
              <button
                onClick={onRetry}
                className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Coba Lagi
              </button>
            )}
            <button
              onClick={reset}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorAlert;
