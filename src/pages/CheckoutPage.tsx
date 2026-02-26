import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Spinner } from '../components/ui/Spinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { CountdownTimer } from '../components/ui/CountdownTimer';
import { getReservation } from '../services/reservations';
import { createOrder } from '../services/orders';
import { useAuth } from '../context/AuthContext';
import type { Reservation } from '../types/reservation';

export function CheckoutPage() {
  const { reservationId } = useParams<{ reservationId: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  
  // Calculate total price (Prisma returns Decimal as string)
  const totalPrice = reservation?.product 
    ? Number(reservation.product.price) * (reservation?.quantity || 1) 
    : 0;
  
  // Check authentication on mount
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
      return;
    }
  }, [isLoggedIn, navigate]);
  
  // Fetch reservation on mount
  useEffect(() => {
    if (!reservationId) {
      setError('Invalid reservation');
      setLoading(false);
      return;
    }
    
    if (!isLoggedIn) {
      return;
    }
    
    async function fetchReservation() {
      if (!reservationId) return;
      
      try {
        const data = await getReservation(reservationId);
        
        // Check if reservation is still valid
        if (data.status === 'expired') {
          navigate('/sold-out');
          return;
        }
        
        if (data.status === 'completed') {
          navigate(`/confirmation/${data.id}`);
          return;
        }
        
        setReservation(data);
        setError(null);
      } catch (err) {
        const error = err as Error;
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchReservation();
  }, [reservationId, navigate, isLoggedIn]);
  
  // Handle timer expiration
  useEffect(() => {
    if (reservation?.expiresAt) {
      const checkExpiration = setInterval(() => {
        const expiresAt = new Date(reservation.expiresAt).getTime();
        const now = Date.now();
        if (now >= expiresAt) {
          navigate('/sold-out');
        }
      }, 1000);
      
      return () => clearInterval(checkExpiration);
    }
  }, [reservation, navigate]);
  
  const handleCheckout = async () => {
    if (!reservationId) return;
    
    setProcessing(true);
    setError(null);
    
    try {
      const order = await createOrder(reservationId);
      navigate(`/confirmation/${order.id}`);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      
      // If reservation expired, redirect to sold out
      if (error.message.includes('expired')) {
        setTimeout(() => navigate('/sold-out'), 2000);
      }
    } finally {
      setProcessing(false);
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
  
  if (error && !reservation) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <ErrorMessage message={error} />
            <button
              onClick={() => navigate('/')}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Back to Home
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Complete Your Purchase
          </h1>
          
          {reservation && (
            <>
              {/* Timer Warning Banner */}
              <div className={`mb-6 rounded-lg p-4 text-center ${
                reservation.expiresAt && 
                new Date(reservation.expiresAt).getTime() - Date.now() < 60000
                  ? 'bg-red-50 border border-red-200'
                  : 'bg-blue-50 border border-blue-200'
              }`}>
                <p className="text-sm text-gray-600 mb-2">
                  Time remaining to complete your purchase:
                </p>
                <CountdownTimer expiresAt={reservation.expiresAt} showWarning />
              </div>
              
              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product</span>
                    <span className="font-medium">{reservation.product?.name || 'Loading...'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity</span>
                    <span className="font-medium">{reservation.quantity}</span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-blue-600">${Number(totalPrice).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {/* Error Message */}
              {error && (
                <div className="mb-4">
                  <ErrorMessage message={error} />
                </div>
              )}
              
              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={processing}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                  processing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                }`}
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner size="sm" />
                    Processing...
                  </span>
                ) : (
                  'Complete Purchase'
                )}
              </button>
              
              <p className="text-center text-gray-500 text-sm mt-4">
                By completing this purchase, you agree to our terms and conditions.
              </p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
