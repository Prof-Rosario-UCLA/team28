// Navbar.tsx: for a consistent navbar across all pages

import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout?: () => void;
  onEditProfile?: () => void;
  isEditing?: boolean;
}

const Navbar = ({ isAuthenticated, onLogout, onEditProfile, isEditing }: NavbarProps) => {
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
              <Link to="/matches" className="text-gray-300 hover:text-white transition-colors">Matches</Link>
              <Link to="/profile" className="text-gray-300 hover:text-white transition-colors">Profile</Link>
              {onEditProfile && (
                <button 
                  onClick={onEditProfile}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Edit Profile
                </button>
              )}
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