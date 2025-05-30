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
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check localStorage on initial load
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  // Update localStorage when authentication state changes
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated.toString());
  }, [isAuthenticated]);

  // Protected Route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) {
      return <Navigate to="/" />;
    }
    return <>{children}</>;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <Routes>
          <Route path="/" element={<Landing />} />
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