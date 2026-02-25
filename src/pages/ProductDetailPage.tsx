import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Spinner } from '../components/ui/Spinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { CountdownTimer } from '../components/ui/CountdownTimer';
import { ReserveButton } from '../components/product/ReserveButton';
import { getProduct } from '../services/products';
import { useReservation } from '../hooks/useReservation';
import { useAuth } from '../context/AuthContext';
import type { Product } from '../types/product';

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { reservation, loading: reservationLoading, error: reservationError, reserve } = useReservation();
  const [reserved, setReserved] = useState(false);
  const [reservationTimer, setReservationTimer] = useState<string | null>(null);
  
  // Fetch product on mount
  useEffect(() => {
    async function fetchProduct() {
      if (!productId) {
        setError('Invalid product');
        setLoading(false);
        return;
      }
      
      try {
        const data = await getProduct(productId);
        setProduct(data);
        setError(null);
      } catch (err) {
        setError('Failed to load product');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProduct();
  }, [productId]);
  
  // Handle successful reservation
  useEffect(() => {
    if (reservation && !reserved) {
      setReserved(true);
      setReservationTimer(reservation.expiresAt);
    }
  }, [reservation, reserved]);
  
  // Handle reservation expiration
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
  
  const handleReserve = async () => {
    if (!productId) return;
    
    const result = await reserve(productId);
    if (result) {
      navigate(`/checkout/${result.id}`);
    }
  };
  
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
  
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <ErrorMessage message={error || 'Product not found'} />
            <button
              onClick={() => navigate('/')}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Back to Products
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const isSoldOut = product.stock === 0;
  const isLimited = product.stock > 0 && product.stock <= 10;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Reservation Timer */}
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
        
        {/* Product Details */}
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            ← Back to Products
          </button>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex">
              {/* Product Image */}
              <div className="md:w-1/2">
                <img
                  src={product.image_url || '/placeholder.jpg'}
                  alt={product.name}
                  className={`w-full h-96 md:h-full object-cover ${isSoldOut ? 'grayscale opacity-50' : ''}`}
                />
              </div>
              
              {/* Product Info */}
              <div className="md:w-1/2 p-8">
                <div className="mb-4">
                  {isSoldOut ? (
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                      Sold Out
                    </span>
                  ) : isLimited ? (
                    <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-sm font-medium">
                      Limited Stock
                    </span>
                  ) : (
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                      In Stock
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
                
                <p className="text-4xl font-bold text-blue-600 mb-6">
                  ${product.price.toFixed(2)}
                </p>
                
                <p className="text-gray-600 mb-6">
                  {product.description}
                </p>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-1">Availability:</p>
                  <p className={`font-medium ${isSoldOut ? 'text-red-600' : 'text-green-600'}`}>
                    {isSoldOut ? 'Out of Stock' : `${product.stock} items available`}
                  </p>
                </div>
                
                {/* Error Message */}
                {reservationError && (
                  <div className="mb-4">
                    <ErrorMessage message={reservationError} />
                  </div>
                )}
                
                {/* Reserve Button - allow clicking on sold out products to redirect */}
                <ReserveButton
                  onClick={() => {
                    if (isSoldOut) {
                      navigate('/sold-out');
                      return;
                    }
                    handleReserve();
                  }}
                  disabled={reserved}
                  loading={reservationLoading}
                  requireAuth={!isLoggedIn}
                  onLoginClick={() => window.dispatchEvent(new CustomEvent('openLoginModal'))}
                />
                
                {reserved && (
                  <p className="text-center text-green-600 mt-4">
                    Product reserved! Redirecting to checkout...
                  </p>
                )}
                
                {isSoldOut && (
                  <p className="text-center text-gray-500 mt-4">
                    This item is currently out of stock.
                  </p>
                )}
                
                {!isSoldOut && product.stock <= 10 && (
                  <p className="text-center text-red-500 mt-4 animate-pulse">
                    Hurry! Only {product.stock} left in stock!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
