import { useAppStore } from '../store/appStore';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

export function useSummarize() {
  const { setStatus, setResult, setError, setCurrentStep, options, addToHistory } = useAppStore();

  const summarize = async (url) => {
    setStatus('loading');
    setCurrentStep('validating');

    try {
      // Small artificial delays to show progress steps to the user (as per PRD Section 7.2)
      await new Promise(r => setTimeout(r, 800));
      
      setCurrentStep('fetching');
      await new Promise(r => setTimeout(r, 1000));
      
      setCurrentStep('transcribing');
      await new Promise(r => setTimeout(r, 1200));
      
      setCurrentStep('processing');
      
      const response = await apiClient.post('/api/summarize', {
        url,
        outputLanguage: options.outputLanguage,
        summaryLength: options.summaryLength,
      });

      if (response.data.success) {
        setResult(response.data.data);
        addToHistory(response.data.data);
      } else {
        throw response.data.error;
      }
    } catch (err) {
      console.error('[Summarize Hook Error]:', err);
      const errorData = err.response?.data?.error || err || {
        code: 'UNKNOWN_ERROR',
        message: 'Terjadi kesalahan tidak terduga.',
        suggestion: 'Pastikan server backend berjalan dan coba lagi.',
        retryable: true,
      };
      setError(errorData);
    }
  };

  return { summarize };
}
