interface BadgeProps {
  variant: 'sold-out' | 'live' | 'limited';
  className?: string;
}

export function Badge({ variant, className = '' }: BadgeProps) {
  const variantClasses = {
    'sold-out': 'bg-gray-500 text-white',
    'live': 'bg-red-500 text-white',
    'limited': 'bg-yellow-500 text-white',
  };

  const label = {
    'sold-out': 'SOLD OUT',
    'live': 'LIVE',
    'limited': 'LIMITED',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {label[variant]}
    </span>
  );
}
