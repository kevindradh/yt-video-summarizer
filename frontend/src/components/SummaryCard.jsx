import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { User, Calendar, Copy, Check, Play, List, FileText, FileDown } from 'lucide-react';
import { jsPDF } from 'jspdf';

const SummaryCard = () => {
  const result = useAppStore((s) => s.result);
  const reset = useAppStore((s) => s.reset);
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const handleCopy = () => {
    const text = `Ringkasan Video: ${result.title}\n\n${result.summary}\n\nPoin-poin Penting:\n${result.keyPoints.map(p => `- ${p.point}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    const width = 170;
    let y = 20;

    // Header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    const titleLines = doc.splitTextToSize(result.title, width);
    doc.text(titleLines, margin, y);
    y += (titleLines.length * 7) + 10;

    // Metadata
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Channel: ${result.channel}`, margin, y);
    y += 6;
    doc.text(`URL: https://youtube.com/watch?v=${result.videoId}`, margin, y);
    y += 10;

    // Summary Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Ringkasan:', margin, y);
    y += 8;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const summaryLines = doc.splitTextToSize(result.summary, width);
    doc.text(summaryLines, margin, y);
    y += (summaryLines.length * 6) + 10;

    // Key Points Section
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Poin Penting:', margin, y);
    y += 8;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    result.keyPoints.forEach((p, i) => {
      const pointText = `${i + 1}. ${p.point}`;
      const pointLines = doc.splitTextToSize(pointText, width);
      
      if (y + (pointLines.length * 6) > 280) {
        doc.addPage();
        y = 20;
      }
      
      doc.text(pointLines, margin, y);
      y += (pointLines.length * 6) + 2;
    });

    doc.save(`${result.title.replace(/[^\w\s]/gi, '')}_summary.pdf`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left px-4 md:px-0">
      {/* Video Metadata Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row">
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
              className="bg-gray-900/80 text-white p-3 rounded-full transform group-hover:scale-110 transition-transform"
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
              <User size={16} className="mr-2 text-gray-400" />
              <span className="truncate">{result.channel}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar size={16} className="mr-2 text-gray-400" />
              <span>{new Date(result.publishedAt).toLocaleDateString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Content */}
      <div className="mt-8 space-y-8">
        {/* Main Summary */}
        <section className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <FileText className="text-gray-600 dark:text-gray-400 w-5 h-5" />
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">Ringkasan Utama</h4>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleCopy}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500"
                title="Copy to clipboard"
              >
                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
              </button>
              <button 
                onClick={handleDownloadPDF}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium border border-gray-200 dark:border-gray-600"
                title="Download PDF"
              >
                <FileDown size={18} />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-lg">
            {result.summary}
          </p>
        </section>

        {/* Key Points Section */}
        <section className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-6">
            <List className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">Poin Penting</h4>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.keyPoints.map((point, idx) => (
              <li key={idx} className="flex items-start space-x-3 text-sm bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800 text-left">
                <span className="flex-shrink-0 w-6 h-6 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </span>
                <p className="leading-relaxed text-gray-700 dark:text-gray-300">{point.point}</p>
              </li>
            ))}
          </ul>
        </section>
        
        <button
          onClick={reset}
          className="w-full py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-lg transition-all flex items-center justify-center space-x-2 border border-gray-200 dark:border-gray-700"
        >
          <span>Ringkas Video Lain</span>
        </button>
      </div>
    </div>
  );
};

export default SummaryCard;
