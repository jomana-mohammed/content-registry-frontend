import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
  fullScreen?: boolean;
  message?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  color = '#4F46E5',
  className = '',
  fullScreen = false,
  message
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-t-transparent rounded-full animate-spin`}
        style={{ 
          borderColor: color,
          borderTopColor: 'transparent'
        }}
      />
      {message && (
        <p className="mt-3 text-sm text-gray-600 animate-pulse">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Spinner;
