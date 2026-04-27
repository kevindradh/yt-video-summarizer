import React from 'react';
import { useAppStore } from '../store/appStore';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';

const LOADING_STEPS = [
  { id: 'validating',    label: 'Memeriksa URL...' },
  { id: 'fetching',      label: 'Mengambil data video...' },
  { id: 'transcribing',  label: 'Membaca transkrip video...' },
  { id: 'processing',    label: 'AI sedang meringkas...' },
];

const LoadingState = () => {
  const { currentStep } = useAppStore();

  const getStepIndex = (stepId) => LOADING_STEPS.findIndex(s => s.id === stepId);
  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 p-8 card-container animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-8">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-full"></div>
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-2">Sedang Memproses Video</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Mohon tunggu sebentar, AI kami sedang menganalisis konten untuk Anda.
        </p>

        <div className="w-full space-y-4 max-w-sm">
          {LOADING_STEPS.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isActive = index === currentIndex;

            return (
              <div key={step.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : isActive ? (
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                  )}
                </div>
                <span className={`text-sm font-medium ${
                  isActive ? 'text-blue-600 dark:text-blue-400' : 
                  isCompleted ? 'text-gray-900 dark:text-gray-100' : 
                  'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
