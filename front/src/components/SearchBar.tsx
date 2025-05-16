import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Option {
  value: string;
  label: string;
}

interface SearchBarProps {
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
  selected: string;
  onSelectChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  options,
  value,
  onValueChange,
  selected,
  onSelectChange,
  placeholder,
  className = ''
}: SearchBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === selected);

  // Zamknięcie dropdownu po kliknięciu poza komponent
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={`flex w-full max-w-full items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 ${className}`}
      style={{ minWidth: 0 }}
    >
      <div className="relative flex-shrink-0">
        <button
          type="button"
          className="flex items-center px-3 py-2 h-full text-gray-700 dark:text-white bg-gray-100 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-600 focus:outline-none min-w-[110px]"
          onClick={() => setDropdownOpen(prev => !prev)}
          tabIndex={0}
        >
          <span className=" mr-2">Search</span>
          <svg
            className={`w-4 h-4 transform transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Animowany dropdown */}
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0.8, height: 0 }}
              animate={{ opacity: 1, scaleY: 1, height: 'auto' }}
              exit={{ opacity: 0, scaleY: 0.8, height: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 z-10 mt-1 w-max min-w-full origin-top bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg overflow-hidden"
            >
              {options.map(opt => (
                <button
                  key={opt.value}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                    opt.value === selected ? 'font-bold bg-gray-100 dark:bg-gray-700' : ''
                  }`}
                  onClick={() => {
                    onSelectChange(opt.value);
                    setDropdownOpen(false); 
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <input
        type="text"
        className="flex-1 min-w-0 px-3 py-2 bg-transparent text-gray-900 dark:text-white focus:outline-none"
        value={value}
        onChange={e => onValueChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
