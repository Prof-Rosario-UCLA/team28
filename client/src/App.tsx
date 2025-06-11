import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Landing from './pages/landing';
import Profile from './pages/profile';
import Matches from './pages/Matches';
import Likes from './pages/Likes';
import PotentialMatches from './pages/potentialmatches';
import OnboardingForm from './components/OnboardingForm';
import CookieConsent from './components/CookieConsent';
import About from './pages/About';


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

        if (!navigator.onLine) {
          setIsAuthenticated(true);  // we know token exists
          setIsLoading(false);
          return;
        }

        // verify token with backend
        const response = await fetch('/api/auth/me', {
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
          <Route path="/about" element={<About />} />
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
          <Route
            path="/likes"
            element={
              <ProtectedRoute>
                <Likes />
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