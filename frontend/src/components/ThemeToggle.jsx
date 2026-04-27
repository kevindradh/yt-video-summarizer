import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useAppStore } from '../store/appStore';

const ThemeToggle = () => {
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);

  const themes = [
    { id: 'light', icon: <Sun size={16} />, label: 'Light' },
    { id: 'dark', icon: <Moon size={16} />, label: 'Dark' },
    { id: 'system', icon: <Monitor size={16} />, label: 'Auto' },
  ];

  return (
    <div className="flex bg-gray-200 dark:bg-gray-800 p-1 rounded-xl">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          className={`p-2 rounded-lg transition-all flex items-center space-x-1 ${
            theme === t.id 
              ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' 
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          title={`Switch to ${t.label} mode`}
        >
          {t.icon}
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;
