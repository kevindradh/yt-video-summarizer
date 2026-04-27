import { create } from 'zustand';

export const useAppStore = create((set) => ({
  // Input state
  inputUrl: '',
  options: {
    outputLanguage: 'id',   // 'id' | 'en'
    summaryLength: 'normal', // 'short' | 'normal' | 'detailed'
  },

  // Process state
  status: 'idle', // 'idle' | 'loading' | 'success' | 'error'
  currentStep: null,
  progress: 0,    // 0-100 untuk video panjang

  // Result state
  result: null,   // SummaryResponse object
  error: null,    // ErrorResponse object

  // History state
  history: [],    // Array of past SummaryResponse

  // Actions
  setInputUrl: (url) => set({ inputUrl: url }),
  setOptions: (opts) => set((s) => ({ options: { ...s.options, ...opts } })),
  setStatus: (status) => set({ status }),
  setResult: (result) => set({ result, status: 'success' }),
  setError: (error) => set({ error, status: 'error' }),
  setCurrentStep: (step) => set({ currentStep: step }),
  addToHistory: (result) => set((s) => ({ history: [result, ...s.history].slice(0, 20) })),
  reset: () => set({ status: 'idle', result: null, error: null, progress: 0, currentStep: null }),
}));
