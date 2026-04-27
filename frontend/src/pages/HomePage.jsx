import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { useShallow } from 'zustand/react/shallow';
import { useSummarize } from '../hooks/useSummarize';
import UrlInput from '../components/UrlInput';
import LoadingState from '../components/LoadingState';
import ErrorAlert from '../components/ErrorAlert';
import SummaryCard from '../components/SummaryCard';
import ThemeToggle from '../components/ThemeToggle';
import { Play, Globe, FileText, History } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  
  // Atomic selectors for better stability in React 19
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
      <header className="w-full max-w-5xl flex justify-between items-center mb-16">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="bg-red-600 p-2 rounded-lg text-white">
            <Play size={24} fill="currentColor" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">YouTube Summarizer</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <button 
            onClick={() => navigate('/history')}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <History size={18} />
            <span>History</span>
          </button>
        </div>
      </header>


      {/* Main Content */}
      <main className="w-full max-w-5xl flex flex-col items-center">
        {status === 'idle' && (
          <div className="w-full text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-blue-600">
              Ringkas Video YouTube dalam Detik
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
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
          </div>
        )}

        {status === 'loading' && <LoadingState />}
        {status === 'error' && <ErrorAlert onRetry={handleRetry} />}
        {status === 'success' && <SummaryCard />}
      </main>

      <footer className="mt-auto pt-20 text-gray-400 text-sm">
        &copy; 2026 YouTube Summarizer.
      </footer>
    </div>
  );
};

export default HomePage;
