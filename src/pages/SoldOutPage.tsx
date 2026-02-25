import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Badge } from '../components/ui/Badge';

export function SoldOutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Sold Out Badge */}
            <div className="mb-6">
              <Badge variant="sold-out" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              This drop has ended
            </h1>
            
            <p className="text-gray-600 mb-8">
              Sorry, the item you were looking for is no longer available. 
              All stock has been reserved.
            </p>
            
            {/* Product Image - grayed out */}
            <div className="relative mb-8">
              <div className="w-64 h-64 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Product Image</span>
              </div>
              <div className="absolute inset-0 bg-gray-900 bg-opacity-30 flex items-center justify-center rounded-lg">
                <span className="text-white font-semibold text-lg">SOLD OUT</span>
              </div>
            </div>
            
            {/* Notify Me CTA (UI only) */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold mb-2">
                Be the first to know about the next drop!
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Enter your email to get notified when new items are available.
              </p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Notify Me
                </button>
              </form>
            </div>
            
            <Link
              to="/"
              className="inline-block w-full py-3 px-6 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-lg transition-colors"
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
