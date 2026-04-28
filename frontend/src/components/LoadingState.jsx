import { useAppStore } from '../store/appStore';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { LOADING_STEPS } from '../utils/constants';

const LoadingState = () => {
  const currentStep = useAppStore((s) => s.currentStep);
  const progress = useAppStore((s) => s.progress);

  const getStepIndex = (stepId) => LOADING_STEPS.findIndex(s => s.id === stepId);
  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 p-10 card-container animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col items-center text-center">
        {/* Percentage Indicator */}
        <div className="relative mb-10 flex flex-col items-center">
          <div className="relative">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="44"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-100 dark:text-gray-700"
              />
              <circle
                cx="48"
                cy="48"
                r="44"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={276}
                strokeDashoffset={276 - (276 * progress) / 100}
                strokeLinecap="round"
                className="text-red-600 transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-red-600">
              {progress}%
            </div>
          </div>
        </div>
        
        <h3 className="text-2xl font-bold mb-2">Sedang Memproses Video</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-10">
          Mohon tunggu sebentar, AI kami sedang menganalisis konten untuk Anda.
        </p>

        {/* Vertical Stepper with Lines */}
        <div className="w-full max-w-sm relative text-left">
          <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 ml-[1px]"></div>
          
          <div className="space-y-8">
            {LOADING_STEPS.map((step, index) => {
              const isCompleted = index < currentIndex;
              const isActive = index === currentIndex;

              return (
                <div key={step.id} className="flex items-center space-x-6 relative z-10">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-500' : isActive ? 'bg-red-600 animate-pulse' : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    ) : isActive ? (
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full" />
                    )}
                  </div>
                  <span className={`text-base font-semibold transition-colors duration-300 ${
                    isActive ? 'text-red-600 dark:text-red-400' : 
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
    </div>
  );
};

export default LoadingState;
