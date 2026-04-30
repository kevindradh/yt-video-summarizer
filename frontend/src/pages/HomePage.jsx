import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { useSummarize } from '../hooks/useSummarize';
import UrlInput from '../components/UrlInput';
import LoadingState from '../components/LoadingState';
import ErrorAlert from '../components/ErrorAlert';
import SummaryCard from '../components/SummaryCard';
import ThemeToggle from '../components/ThemeToggle';
import { Play, Globe, FileText, History } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  
  const status = useAppStore((s) => s.status);
  const options = useAppStore((s) => s.options);
  const inputUrl = useAppStore((s) => s.inputUrl);

  const setOptions = useAppStore((s) => s.setOptions);
  const setInputUrl = useAppStore((s) => s.setInputUrl);

  const { summarize } = useSummarize();

  const handleSummarize = (url) => {
    setInputUrl(url);
    summarize(url);
  };

  const handleRetry = () => {
    if (inputUrl) {
      summarize(inputUrl);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center px-4 py-12 transition-colors">
      {/* Header */}
      <header className="w-full max-w-5xl flex justify-between items-center mb-12 md:mb-16 gap-4">
        <div className="flex items-center space-x-2 cursor-pointer flex-shrink-0" onClick={() => navigate('/')}>
          <div className="bg-red-600 p-1.5 md:p-2 rounded-lg text-white">
            <Play size={20} className="md:w-6 md:h-6" fill="currentColor" />
          </div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight">YouTube Summarizer</h1>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <ThemeToggle />
          <button 
            onClick={() => navigate('/history')}
            className="flex items-center space-x-2 p-2 md:px-4 md:py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="History"
          >
            <History size={20} />
            <span className="hidden md:inline">History</span>
          </button>
        </div>
      </header>


      {/* Main Content */}
      <main className="w-full max-w-5xl flex flex-col items-center">
        {status === 'idle' && (
          <div className="w-full text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-red-600">
              Ringkas Video YouTube dalam Detik
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Dapatkan inti konten video, poin-poin kunci, dan ringkasan terstruktur tanpa perlu menonton seluruh video.
            </p>

            <UrlInput onValidUrl={handleSummarize} isLoading={status === 'loading'} />

            {/* Options Panel */}
            <div className="mt-8 flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 text-sm">
              <div className="flex items-center space-x-3">
                <Globe size={16} className="text-gray-400" />
                <span className="font-medium text-gray-500">Bahasa Output:</span>
                <div className="flex bg-gray-200 dark:bg-gray-800 p-1 rounded-lg transition-colors">
                  <button
                    onClick={() => setOptions({ outputLanguage: 'id' })}
                    className={`btn-toggle ${options.outputLanguage === 'id' ? 'active' : ''}`}
                  >
                    🇮🇩 Indonesia
                  </button>
                  <button
                    onClick={() => setOptions({ outputLanguage: 'en' })}
                    className={`btn-toggle ${options.outputLanguage === 'en' ? 'active' : ''}`}
                  >
                    🇺🇸 English
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FileText size={16} className="text-gray-400" />
                <span className="font-medium text-gray-500">Panjang:</span>
                <div className="flex bg-gray-200 dark:bg-gray-800 p-1 rounded-lg transition-colors">
                  {['short', 'normal', 'detailed'].map((len) => (
                    <button
                      key={len}
                      onClick={() => setOptions({ summaryLength: len })}
                      className={`btn-toggle capitalize ${options.summaryLength === len ? 'active' : ''}`}
                    >
                      {len === 'short' ? 'Singkat' : len === 'normal' ? 'Normal' : 'Detail'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* How it works */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              {[
                { step: '1', title: 'Paste URL', desc: 'Masukkan link video YouTube yang ingin Anda ringkas.' },
                { step: '2', title: 'AI Memproses', desc: 'Kami mengambil transkrip dan memprosesnya menggunakan AI.' },
                { step: '3', title: 'Dapatkan Hasil', desc: 'Baca ringkasan dan poin-poin kunci dalam hitungan detik.' },
              ].map((item) => (
                <div key={item.step} className="p-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-900 transition-colors">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full flex items-center justify-center font-bold mb-4 mx-auto text-lg">
                    {item.step}
                  </div>
                  <h3 className="font-bold mb-2 text-lg">{item.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {status === 'loading' && <LoadingState />}
        {status === 'error' && <ErrorAlert onRetry={handleRetry} />}
        {status === 'success' && <SummaryCard />}
      </main>

      <footer className="mt-auto pt-20 text-gray-400 text-sm">
        &copy; 2026 YouTube Summarizer. Made with ❤️ for efficiency.
      </footer>
    </div>
  );
};

export default HomePage;
