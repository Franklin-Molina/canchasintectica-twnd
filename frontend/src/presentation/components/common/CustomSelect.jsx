import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

function CustomSelect({ options, value, onChange, placeholder = "Seleccionar..." }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={selectRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 transition-all"
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 top-full mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden animate-fade-in-down">
          <ul>
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                  value === option.value
                    ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                    : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CustomSelect;
