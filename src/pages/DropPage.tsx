import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ProductCard } from '../components/product/ProductCard';
import { Spinner } from '../components/ui/Spinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { CountdownTimer } from '../components/ui/CountdownTimer';
import { getAllProducts } from '../services/products';
import { useStockPolling } from '../hooks/useStockPolling';
import { useReservation } from '../hooks/useReservation';
import type { Product } from '../types/product';

 export function DropPage() {
  const navigate = useNavigate();
  
  // State for all products
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Selected product for reservation
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  
  // Handle login click from reserve button - dispatch event to open Navbar login
  const handleLoginClick = () => {
    window.dispatchEvent(new CustomEvent('openLoginModal'));
  };
  
  // Get stock polling for selected product
  useStockPolling(selectedProductId || '');
  const { reservation, reserve } = useReservation();
  
  const [reserved, setReserved] = useState(false);
  const [reservationTimer, setReservationTimer] = useState<string | null>(null);
  
  // Fetch all products on mount
  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getAllProducts();
        setProducts(data);
        // Auto-select first available product
        const availableProduct = data.find(p => p.stock > 0);
        if (availableProduct) {
          setSelectedProductId(availableProduct.id);
        }
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, []);
  
  // Handle successful reservation
  useEffect(() => {
    if (reservation && !reserved) {
      setReserved(true);
      setReservationTimer(reservation.expiresAt);
    }
  }, [reservation, reserved]);
  
  // Handle reservation expiration - redirect to sold out
  useEffect(() => {
    if (reserved && reservationTimer) {
      const checkExpiration = setInterval(() => {
        const expiresAt = new Date(reservationTimer).getTime();
        const now = Date.now();
        if (now >= expiresAt) {
          navigate('/sold-out');
        }
      }, 1000);
      
      return () => clearInterval(checkExpiration);
    }
  }, [reserved, reservationTimer, navigate]);
  
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Spinner size="lg" />
        </main>
        <Footer />
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <ErrorMessage message={error} />
        </main>
        <Footer />
      </div>
    );
  }
  
  // Show empty state
  if (products.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-gray-500">No products available</p>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Show reservation timer if reserved */}
        {reserved && reservationTimer && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-sm text-blue-600 mb-2">
              Your reservation is held for:
            </p>
            <CountdownTimer expiresAt={reservationTimer} showWarning />
            <p className="text-xs text-blue-500 mt-2">
              Complete your purchase before time runs out!
            </p>
          </div>
        )}
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const isSoldOut = product.stock === 0;
            return (
              <ProductCard
                key={product.id}
                product={product}
                onReserve={async () => {
                  if (isSoldOut) {
                    navigate('/sold-out');
                    return;
                  }
                  const result = await reserve(product.id);
                  if (result) {
                    navigate(`/checkout/${result.id}`);
                  }
                }}
                isReserving={false}
                isReserved={false}
                onLoginClick={handleLoginClick}
              />
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
