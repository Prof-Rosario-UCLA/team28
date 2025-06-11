// Navbar.tsx: for a consistent navbar across all pages

import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout?: () => void;
}

const Navbar = ({ isAuthenticated, onLogout }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      if (onLogout) {
        onLogout();
      } else {
        const token = localStorage.getItem('token');
        
        // Call logout endpoint
        if (token) {
          await fetch('api/auth/logout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        }

        // Clear token
        localStorage.removeItem('token');
        
        // Navigate to home page
        navigate('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear token and navigate even if the API call fails
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  return (
    <nav className="container mx-auto px-4 pt-6 pb-3 sm:pb-6">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-lg sm:text-4xl font-bold text-blue-400">RoomieMatch</Link>
        <div className="space-x-1 sm:space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/potential-matches" className="text-xs sm:text-base text-gray-300 hover:text-white transition-colors">Find</Link>
              <Link to="/matches" className="text-xs sm:text-base text-gray-300 hover:text-white transition-colors">Matches</Link>
              <Link to="/likes" className="text-xs sm:text-base text-gray-300 hover:text-white transition-colors">Likes</Link>
              <Link to="/profile" className="text-xs sm:text-base text-gray-300 hover:text-white transition-colors">Profile</Link>
              <button 
                onClick={handleLogout}
                className="bg-blue-500 text-white px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-base rounded hover:bg-blue-600 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="text-xs sm:text-base text-gray-300 hover:text-white transition-colors">Home</Link>
              <Link to="/about" className="text-xs sm:text-base text-gray-300 hover:text-white transition-colors">About</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;