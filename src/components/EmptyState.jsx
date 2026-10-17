import React from 'react';
import { BookOpen, FileQuestion, PlusCircle, Inbox } from 'lucide-react';
import Button from './Button';

const ICONS = {
  questions: FileQuestion,
  exams: BookOpen,
  default: Inbox,
};

const EmptyState = ({
  title = 'No data found',
  description = 'There is no data to display at this time.',
  action,
  actionLabel,
  icon = 'default',
  onAction,
}) => {
  const Icon = ICONS[icon] || ICONS.default;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon size={28} className="text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-700 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-xs mb-6">{description}</p>
      {onAction && actionLabel && (
        <Button icon={PlusCircle} onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

export const Loading = ({ message = 'Loading...', size = 'md' }) => {
  const sizes = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-14 h-14' };
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className={`${sizes[size]} border-4 border-blue-800 border-t-transparent rounded-full animate-spin`} />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
};

export const PageLoading = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <Loading />
  </div>
);
