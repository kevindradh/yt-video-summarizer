import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { ArrowLeft, Trash2, ExternalLink, Play, Clock } from 'lucide-react';

const HistoryPage = () => {
  const navigate = useNavigate();
  const { history, deleteFromHistory, setResult } = useAppStore();

  const handleRevisit = (item) => {
    setResult(item);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center px-4 py-12">
      <header className="w-full max-w-4xl flex items-center mb-12">
        <button 
          onClick={() => navigate('/')}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors mr-4"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Riwayat Ringkasan</h1>
      </header>

      <main className="w-full max-w-4xl">
        {history.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <Clock size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Belum ada riwayat ringkasan.</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-4 text-blue-600 font-medium hover:underline"
            >
              Mulai meringkas sekarang
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {history.map((item) => (
              <div 
                key={item.videoId}
                className="card-container p-4 flex items-center group hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer"
                onClick={() => handleRevisit(item)}
              >
                <div className="relative w-32 h-20 flex-shrink-0 rounded-xl overflow-hidden mr-6 shadow-sm">
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play size={20} className="text-white fill-white" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 space-x-4 mt-1">
                    <span className="truncate max-w-[150px]">{item.channel}</span>
                    <span>•</span>
                    <span>{new Date(item.processedAt).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFromHistory(item.videoId);
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                  <a 
                    href={`https://youtube.com/watch?v=${item.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoryPage;
