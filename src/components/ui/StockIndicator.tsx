interface StockIndicatorProps {
  stock: number;
  className?: string;
}

export function StockIndicator({ stock, className = '' }: StockIndicatorProps) {
  const getStockColor = () => {
    if (stock === 0) return 'text-gray-400';
    if (stock <= 10) return 'text-red-600';
    if (stock <= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStockLabel = () => {
    if (stock === 0) return 'Out of stock';
    if (stock <= 10) return 'Almost gone!';
    return 'In stock';
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={`font-semibold ${getStockColor()}`}>
        {stock} left
      </span>
      <span className="text-gray-500 text-sm">• {getStockLabel()}</span>
    </div>
  );
}
