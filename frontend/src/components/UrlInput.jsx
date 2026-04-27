import React, { useState, useEffect } from 'react';
import { Search, AlertCircle, CheckCircle2 } from 'lucide-react';
import { validateYouTubeUrl } from '../utils/urlValidator';
import { ERROR_MESSAGES } from '../utils/constants';

const UrlInput = ({ onValidUrl, isLoading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (url.trim() === '') {
      setError(null);
      setIsValid(false);
      return;
    }

    const result = validateYouTubeUrl(url);
    if (result.valid) {
      setError(null);
      setIsValid(true);
    } else {
      setError(ERROR_MESSAGES[result.error] || 'URL tidak valid');
      setIsValid(false);
    }
  }, [url]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      onValidUrl(url);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-gray-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube URL here..."
            disabled={isLoading}
            className={`w-full pl-12 pr-32 py-4 bg-white dark:bg-gray-800 border-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-all ${
              error 
                ? 'border-red-500 focus:ring-red-200' 
                : isValid 
                  ? 'border-green-500 focus:ring-green-200'
                  : 'border-gray-200 dark:border-gray-700 focus:ring-blue-200 focus:border-blue-500'
            }`}
          />
          <button
            type="submit"
            disabled={!isValid || isLoading}
            className={`absolute right-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
              isValid && !isLoading
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Processing...' : 'Ringkas'}
          </button>
        </div>

        {/* Validation Feedback */}
        <div className="mt-2 min-h-[24px]">
          {error && (
            <div className="flex items-center text-red-500 text-sm animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={14} className="mr-1.5" />
              {error}
            </div>
          )}
          {isValid && (
            <div className="flex items-center text-green-600 dark:text-green-400 text-sm animate-in fade-in slide-in-from-top-1">
              <CheckCircle2 size={14} className="mr-1.5" />
              URL valid. Siap diringkas!
            </div>
          )}
        </div>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Format yang didukung: youtube.com, youtu.be, shorts, dan embed.
        </p>
      </div>
    </div>
  );
};

export default UrlInput;
