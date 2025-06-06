import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import Matches from './pages/Matches';
import PotentialMatches from './pages/PotentialMatches';
import OnboardingForm from './components/OnboardingForm';
import CookieConsent from './components/CookieConsent';

const App = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // check authentication status on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // verify token with backend
        const response = await fetch('http://localhost:3000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          // Token is invalid or expired
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    if (!isAuthenticated) {
      return <Navigate to="/" />;
    }
    return <>{children}</>;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <Routes>
          <Route path="/" element={
            <Landing 
              onSignupSuccess={() => setIsAuthenticated(true)} 
              onLoginSuccess={() => setIsAuthenticated(true)}
            />
          } />
          <Route path="/about" element={<div className="container mx-auto px-4 py-20 text-white">
            <h1 className="text-4xl font-bold mb-8">About RoomieMatch</h1>
            <p className="text-xl text-gray-300">Find your perfect roommate match!</p>
          </div>} />
          <Route path="/contact" element={<div className="container mx-auto px-4 py-20 text-white">
            <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
            <p className="text-xl text-gray-300">Get in touch with our team!</p>
          </div>} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/matches"
            element={
              <ProtectedRoute>
                <Matches />
              </ProtectedRoute>
            }
          />
          <Route
            path="/potential-matches"
            element={
              <ProtectedRoute>
                <PotentialMatches />
              </ProtectedRoute>
            }
          />
        </Routes>
        <CookieConsent />

        {/* Onboarding Form */}
        {showOnboarding && (
          <OnboardingForm
            onComplete={() => {
              setShowOnboarding(false);
              setIsAuthenticated(true);
            }}
          />
        )}
      </div>
    </Router>
  );
};

export default App;