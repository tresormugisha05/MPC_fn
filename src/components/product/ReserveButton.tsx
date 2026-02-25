import { useState } from 'react';
import { Spinner } from '../ui/Spinner';

interface ReserveButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
  className?: string;
  requireAuth?: boolean;
  onLoginClick?: () => void;
}

export function ReserveButton({ 
  onClick, 
  disabled, 
  loading, 
  className = '',
  requireAuth = false,
  onLoginClick
}: ReserveButtonProps) {
  
  const [isClicked, setIsClicked] = useState(false);
  
  const handleClick = () => {
    if (requireAuth && onLoginClick) {
      onLoginClick();
    } else if (!disabled && !loading) {
      setIsClicked(true);
      onClick();
    }
  };

  const buttonText = requireAuth ? 'Login to Reserve' : 'Reserve Now';
  const showLoading = loading || isClicked;

  return (
    <button
      onClick={handleClick}
      disabled={disabled || showLoading}
      className={`
        relative w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200
        ${disabled || showLoading
          ? 'bg-gray-400 cursor-not-allowed'
          : requireAuth
            ? 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700'
            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
        }
        ${className}
      `}
    >
      {showLoading ? (
        <span className="flex items-center justify-center gap-2">
          <Spinner size="sm" />
          Reserving...
        </span>
      ) : (
        buttonText
      )}
    </button>
  );
}
