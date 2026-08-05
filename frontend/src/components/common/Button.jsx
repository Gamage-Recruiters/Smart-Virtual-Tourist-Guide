import React from 'react';

/**
 * Reusable Button Component
 * @param {'solid' | 'outline' | 'ghost'} variant - Visual style variant
 * @param {React.ReactNode} children - Button text or elements
 * @param {string} className - Additional CSS utility classes
 */
export const Button = ({ variant = 'solid', children, className = '', ...props }) => {
  const baseClasses =
    'px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer';
  const variantClasses = {
    solid: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 active:scale-95',
    outline: 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50 active:scale-95',
    ghost: 'text-slate-600 hover:bg-slate-100 active:scale-95',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant] || variantClasses.solid} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
