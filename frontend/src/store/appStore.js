import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set) => ({
      // Input state
      inputUrl: '',
      options: {
        outputLanguage: 'id',   // 'id' | 'en'
        summaryLength: 'normal', // 'short' | 'normal' | 'detailed'
      },

      // Process state
      status: 'idle', // 'idle' | 'loading' | 'success' | 'error'
      currentStep: null,
      progress: 0,

      // Result state
      result: null,
      error: null,

      // UI state
      theme: 'system', // 'light' | 'dark' | 'system'
      
      // History state
      history: [],

      // Actions
      setTheme: (theme) => set({ theme }),
      setInputUrl: (url) => set({ inputUrl: url }),
      setOptions: (opts) => set((s) => ({ options: { ...s.options, ...opts } })),
      setStatus: (status) => set({ status }),
      setResult: (result) => set({ result, status: 'success' }),
      setError: (error) => set({ error, status: 'error' }),
      setCurrentStep: (step) => set({ currentStep: step }),
      addToHistory: (result) => set((s) => {
        // Prevent duplicates in history
        const filteredHistory = s.history.filter(item => item.videoId !== result.videoId);
        return { history: [result, ...filteredHistory].slice(0, 20) };
      }),
      deleteFromHistory: (videoId) => set((s) => ({
        history: s.history.filter(item => item.videoId !== videoId)
      })),
      reset: () => set({ status: 'idle', result: null, error: null, progress: 0, currentStep: null }),
    }),
    {
      name: 'yt-summarizer-storage', // key in localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        history: state.history,
        theme: state.theme 
      }), // Persist history and theme
    }
  )
);
