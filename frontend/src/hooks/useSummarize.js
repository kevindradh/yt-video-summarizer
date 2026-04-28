import { useCallback } from 'react';
import { useAppStore } from '../store/appStore';
import axios from 'axios';

const apiClient = axios.create({
  // Use relative path so Nginx proxy handles the request to the backend container
  baseURL: window.location.origin, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export function useSummarize() {
  const setStatus = useAppStore((s) => s.setStatus);
  const setResult = useAppStore((s) => s.setResult);
  const setError = useAppStore((s) => s.setError);
  const setCurrentStep = useAppStore((s) => s.setCurrentStep);
  const setProgress = useAppStore((s) => s.setProgress);
  const addToHistory = useAppStore((s) => s.addToHistory);
  const options = useAppStore((s) => s.options);

  const summarize = useCallback(async (url) => {
    setStatus('loading');
    setCurrentStep('validating');
    setProgress(10);

    try {
      await new Promise(r => setTimeout(r, 600));
      
      setCurrentStep('fetching');
      setProgress(30);
      await new Promise(r => setTimeout(r, 800));
      
      setCurrentStep('transcribing');
      setProgress(50);
      await new Promise(r => setTimeout(r, 1000));
      
      setCurrentStep('processing');
      setProgress(70);
      
      const response = await apiClient.post('/api/summarize', {
        url,
        outputLanguage: options.outputLanguage,
        summaryLength: options.summaryLength,
      });

      if (response.data.success) {
        setProgress(100);
        await new Promise(r => setTimeout(r, 400));
        setResult(response.data.data);
        addToHistory(response.data.data);
      } else {
        throw response.data.error;
      }
    } catch (err) {
      const errorData = err.response?.data?.error || err || {
        code: 'UNKNOWN_ERROR',
        message: 'Terjadi kesalahan tidak terduga.',
        suggestion: 'Pastikan server backend berjalan dan coba lagi.',
        retryable: true,
      };
      setError(errorData);
      setProgress(0);
    }
  }, [setStatus, setResult, setError, setCurrentStep, setProgress, addToHistory, options]);

  return { summarize };
}
