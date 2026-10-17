import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  type = 'button',
  onClick,
  className = '',
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-blue-800 text-white hover:bg-blue-900 focus:ring-blue-700',
    secondary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-400',
    outline: 'border-2 border-blue-800 text-blue-800 bg-transparent hover:bg-blue-50 focus:ring-blue-700',
    ghost: 'text-gray-600 bg-transparent hover:bg-gray-100 focus:ring-gray-300',
    light: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300',
  };

  const sizes = {
    xs: 'text-xs px-2.5 py-1.5 gap-1',
    sm: 'text-sm px-3 py-2 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2',
    xl: 'text-lg px-8 py-3.5 gap-2.5',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Processing...
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={size === 'xs' ? 12 : size === 'sm' ? 14 : 16} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={size === 'xs' ? 12 : size === 'sm' ? 14 : 16} />}
        </>
      )}
    </button>
  );
};

export default Button;
  