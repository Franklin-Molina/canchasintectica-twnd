import React from 'react';

const InputWithIcon = ({ icon: Icon, error, loading, rightElement, ...props }) => {
  const hasError = !!error;

  return (
    <div>
      <div className="relative">
        <Icon 
          className="absolute left-3 top-[52%] -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" 
          strokeWidth={1.5}
        />

        <input
          className={`
            w-full h-12 pl-10 ${rightElement ? 'pr-12' : 'pr-4'}
            border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400
            focus:outline-none
            focus:border-indigo-400 focus:shadow-[0_0_4px_rgba(102,126,234,0.5)]
            transition-[border-color,box-shadow] duration-300
            ${hasError 
              ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700/50 focus:border-red-500 focus:shadow-[0_0_4px_rgba(239,68,68,0.5)]' 
              : ''
            }
            ${loading ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}
          `}
          disabled={loading}
          {...props}
        />

        {rightElement}
      </div>

      {hasError && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default InputWithIcon;
