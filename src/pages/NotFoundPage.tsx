import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* 404 Icon */}
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl font-bold text-gray-400">404</span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h1>
            
            <p className="text-gray-600 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
            
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
