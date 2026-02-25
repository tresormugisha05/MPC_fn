 import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types/product';
import { Badge } from '../ui/Badge';
import { StockIndicator } from '../ui/StockIndicator';
import { ReserveButton } from './ReserveButton';
import { useAuth } from '../../context/AuthContext';

interface ProductCardProps {
  product: Product;
  className?: string;
  onSelect?: () => void;
  isSelected?: boolean;
  onReserve?: () => void;
  isReserving?: boolean;
  isReserved?: boolean;
  onLoginClick?: () => void;
}

export function ProductCard({ 
  product, 
  className = '', 
  onSelect, 
  isSelected,
  onReserve,
  isReserving = false,
  isReserved = false,
  onLoginClick
}: ProductCardProps) {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const isSoldOut = product.stock === 0;
  const isLimited = product.stock > 0 && product.stock <= 10;
  
  // Handle undefined price safely
  const formattedPrice = product.price !== undefined 
    ? `$${product.price.toFixed(2)}` 
    : '$0.00';

  const handleClick = () => {
    if (onSelect && !isSoldOut) {
      onSelect();
    }
  };

  const handleReserveClick = () => {
    if (onReserve && !isReserved) {
      onReserve();
    }
  };

  const handleViewProduct = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  // Show login button if not logged in
  const requireAuth = !isLoggedIn;

  return (
    <div 
      className={`bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 ${isSelected ? 'ring-4 ring-blue-500' : ''} ${className}`}
    >
      <div className="relative" onClick={handleClick}>
        <img
          src={product.image_url || '/placeholder.jpg'}
          alt={product.name}
          className={`w-full h-64 object-cover ${isSoldOut ? 'grayscale opacity-50' : ''}`}
        />
        <div className="absolute top-4 right-4">
          {isSoldOut ? (
            <Badge variant="sold-out" />
          ) : isLimited ? (
            <Badge variant="limited" />
          ) : (
            <Badge variant="live" />
          )}
        </div>
      </div>
      
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {product.name}
        </h1>
        
        <p className="text-3xl font-bold text-blue-600 mb-4">
          {formattedPrice}
        </p>
        
        <p className="text-gray-600 mb-4">
          {product.description}
        </p>
        
        <StockIndicator stock={product.stock} />
        
        {/* Action Buttons */}
        <div className="mt-4 space-y-2">
          {/* View Product Button */}
          <button
            onClick={handleViewProduct}
            className="w-full py-2 px-4 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            View Product
          </button>
          
          {/* Reserve Button for each product - allow clicking on sold out products */}
          <ReserveButton
            onClick={handleReserveClick}
            disabled={isReserved}
            loading={isReserving}
            requireAuth={requireAuth}
            onLoginClick={onLoginClick}
          />
          {isReserved && (
            <p className="text-center text-green-600 text-sm">
              Reserved!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
