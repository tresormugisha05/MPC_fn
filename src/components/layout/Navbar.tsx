import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function Navbar() {
  const { isAdmin, isLoggedIn, login, register, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Listen for custom event to open login modal from reserve buttons
  useEffect(() => {
    const handleOpenLogin = () => {
      setShowLogin(true);
      setShowRegister(false);
    };
    
    window.addEventListener('openLoginModal', handleOpenLogin);
    return () => window.removeEventListener('openLoginModal', handleOpenLogin);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const result = await login(email, password);
    if (result.success) {
      setShowLogin(false);
      setEmail('');
      setPassword('');
    } else {
      setLoginError(result.error || 'Invalid credentials');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess(false);
    const result = await register(email, password, name);
    if (result.success) {
      setRegisterSuccess(true);
      setTimeout(() => {
        setShowRegister(false);
        setShowLogin(false);
        setEmail('');
        setPassword('');
        setName('');
        setRegisterSuccess(false);
      }, 1500);
    } else {
      setRegisterError(result.error || 'Email already registered');
    }
  };

  const handleLogout = () => {
    logout();
  };

  const openLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
    setLoginError('');
  };

  const openRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
    setRegisterError('');
    setRegisterSuccess(false);
  };

  const closeModal = () => {
    setShowLogin(false);
    setShowRegister(false);
    setEmail('');
    setPassword('');
    setName('');
    setLoginError('');
    setRegisterError('');
    setRegisterSuccess(false);
  };

  return (
    <nav className="bg-white shadow-md relative z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex-shrink-0">
            <span className="text-xl font-bold text-blue-600">DropShop</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </Link>
            
            {isAdmin ? (
              <>
                <Link
                  to="/add-product"
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                >
                  Add Product
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={openLogin}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={openRegister}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Login Modal - No Black Background */}
      {showLogin && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0" onClick={closeModal}></div>
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl relative z-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            <form onSubmit={handleLogin}>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                  required
                />
              </div>
              {loginError && (
                <p className="text-red-500 text-sm mb-4">{loginError}</p>
              )}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
            <p className="text-center mt-4 text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={openRegister}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Register
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Register Modal - No Black Background */}
      {showRegister && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0" onClick={closeModal}></div>
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl relative z-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
            <form onSubmit={handleRegister}>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Create a password"
                  required
                />
              </div>
              {registerError && (
                <p className="text-red-500 text-sm mb-4">{registerError}</p>
              )}
              {registerSuccess && (
                <p className="text-green-500 text-sm mb-4">Registration successful! Logging in...</p>
              )}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 font-medium"
                >
                  Register
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
            <p className="text-center mt-4 text-gray-600">
              Already have an account?{' '}
              <button
                onClick={openLogin}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      )}
    </nav>
  );
}
