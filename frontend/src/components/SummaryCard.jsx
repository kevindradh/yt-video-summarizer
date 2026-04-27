import React from 'react';
import { useAppStore } from '../store/appStore';
import { Clock, Calendar, User, Copy, Check, Share2, Play, List, FileText } from 'lucide-react';

const SummaryCard = () => {
  const { result, reset } = useAppStore();
  const [copied, setCopied] = React.useState(false);

  if (!result) return null;

  const handleCopy = () => {
    const text = `Ringkasan Video: ${result.title}\n\n${result.summary}\n\nPoin-poin Penting:\n${result.keyPoints.map(p => `- ${p.point}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      {/* Video Metadata Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row">
        <div className="md:w-1/3 relative group">
          <img 
            src={result.thumbnail} 
            alt={result.title} 
            className="w-full h-full object-cover aspect-video md:aspect-auto"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <a 
              href={`https://youtube.com/watch?v=${result.videoId}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-red-600 text-white p-3 rounded-full transform group-hover:scale-110 transition-transform shadow-lg"
            >
              <Play size={24} fill="currentColor" />
            </a>
          </div>
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded font-bold">
            {result.durationLabel}
          </div>
        </div>
        
        <div className="md:w-2/3 p-6 flex flex-col justify-center">
          <h3 className="text-xl font-bold mb-4 line-clamp-2 leading-tight">
            {result.title}
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <User size={16} className="mr-2 text-blue-500" />
              <span className="truncate">{result.channel}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar size={16} className="mr-2 text-blue-500" />
              <span>{new Date(result.publishedAt).toLocaleDateString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Content */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Summary */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <FileText className="text-blue-600 w-5 h-5" />
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Ringkasan Utama</h4>
              </div>
              <button 
                onClick={handleCopy}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500"
                title="Copy to clipboard"
              >
                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
              </button>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-lg">
              {result.summary}
            </p>
          </section>
        </div>

        {/* Key Points Sidebar */}
        <div className="space-y-8">
          <section className="bg-blue-600 text-white p-8 rounded-3xl shadow-lg">
            <div className="flex items-center space-x-2 mb-6">
              <List className="w-5 h-5" />
              <h4 className="text-lg font-bold">Poin Penting</h4>
            </div>
            <ul className="space-y-4">
              {result.keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-sm bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10 text-left">
                  <span className="flex-shrink-0 w-6 h-6 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </span>
                  <p className="leading-snug">{point.point}</p>
                </li>
              ))}
            </ul>
          </section>
          
          <button
            onClick={reset}
            className="w-full py-4 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-2xl transition-all flex items-center justify-center space-x-2"
          >
            <span>Ringkas Video Lain</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
