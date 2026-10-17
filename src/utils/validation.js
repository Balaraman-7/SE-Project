// Validation utilities
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

export const validateMinLength = (value, min) => {
  return value && value.length >= min;
};

export const validateForm = (fields) => {
  const errors = {};
  Object.entries(fields).forEach(([key, { value, rules }]) => {
    if (rules.required && !validateRequired(value)) {
      errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
    } else if (rules.email && value && !validateEmail(value)) {
      errors[key] = 'Please enter a valid email address';
    } else if (rules.minLength && value && !validateMinLength(value, rules.minLength)) {
      errors[key] = `Minimum ${rules.minLength} characters required`;
    }
  });
  return errors;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const formatTime = (timeStr) => {
  if (!timeStr) return '-';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
};

export const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return '-';
  const date = new Date(dateTimeStr);
  return date.toLocaleString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

export const formatDuration = (minutes) => {
  if (!minutes) return '-';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
};

export const getStatusColor = (status) => {
  const map = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-red-100 text-red-700',
    upcoming: 'bg-blue-100 text-blue-700',
    completed: 'bg-gray-100 text-gray-700',
    ongoing: 'bg-orange-100 text-orange-700',
    pass: 'bg-green-100 text-green-700',
    fail: 'bg-red-100 text-red-700',
    published: 'bg-green-100 text-green-700',
    draft: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-700',
    pending: 'bg-orange-100 text-orange-700',
  };
  return map[status?.toLowerCase()] || 'bg-gray-100 text-gray-700';
};

export const getDifficultyColor = (difficulty) => {
  const map = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700',
  };
  return map[difficulty?.toLowerCase()] || 'bg-gray-100 text-gray-700';
};
