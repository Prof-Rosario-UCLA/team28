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

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userData');
      navigate('/');
    }
  };

  return (
    <nav className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-400">RoomieMatch</Link>
        <div className="space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/potential-matches" className="text-gray-300 hover:text-white transition-colors">Find Matches</Link>
              <Link to="/matches" className="text-gray-300 hover:text-white transition-colors">My Matches</Link>
              <Link to="/profile" className="text-gray-300 hover:text-white transition-colors">Profile</Link>
              <button 
                onClick={handleLogout}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
              <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
              <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 