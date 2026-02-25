import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export function ConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Success Icon */}
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your order is confirmed!
            </h1>
            
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. We've sent a confirmation email with your order details.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-mono font-semibold text-lg">{orderId}</p>
            </div>
            
            {/* Order Summary */}
            <div className="text-left border-t pt-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Limited Edition Item</span>
                  <span className="font-medium">$99.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-medium">1</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-blue-600">$99.00</span>
                </div>
              </div>
            </div>
            
            <Link
              to="/"
              className="inline-block w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
