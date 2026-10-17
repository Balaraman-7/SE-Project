import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = React.forwardRef(({
  label,
  error,
  hint,
  icon: Icon,
  type = 'text',
  required = false,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`flex flex-col gap-1 ${containerClassName}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={16} />
          </div>
        )}
        <input
          ref={ref}
          type={inputType}
          className={`
            w-full rounded-lg border text-sm text-gray-800 bg-white
            placeholder:text-gray-400 transition-all duration-150
            focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent
            ${Icon ? 'pl-9' : 'pl-3'}
            ${isPassword ? 'pr-10' : 'pr-3'}
            py-2.5
            ${error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 hover:border-gray-400'}
            ${className}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export const Textarea = React.forwardRef(({
  label,
  error,
  required = false,
  rows = 4,
  className = '',
  ...props
}, ref) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <textarea
      ref={ref}
      rows={rows}
      className={`
        w-full rounded-lg border text-sm text-gray-800 bg-white px-3 py-2.5
        placeholder:text-gray-400 resize-y
        focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent
        ${error ? 'border-red-400' : 'border-gray-300 hover:border-gray-400'}
        ${className}
      `}
      {...props}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
));

Textarea.displayName = 'Textarea';

export const Select = React.forwardRef(({
  label,
  error,
  required = false,
  options = [],
  placeholder = 'Select...',
  className = '',
  ...props
}, ref) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <select
      ref={ref}
      className={`
        w-full rounded-lg border text-sm text-gray-800 bg-white px-3 py-2.5
        focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent
        ${error ? 'border-red-400' : 'border-gray-300 hover:border-gray-400'}
        ${className}
      `}
      {...props}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
));

Select.displayName = 'Select';

export default Input;
