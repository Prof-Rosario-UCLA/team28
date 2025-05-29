import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import OnboardingForm from '../components/OnboardingForm';

const Landing = () => {
  const navigate = useNavigate();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check if user is authenticated and has completed their profile
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userData = localStorage.getItem('userData');
    
    if (isAuthenticated && userData) {
      const data = JSON.parse(userData);
      // Only redirect if the user has completed their profile
      if (data.profile) {
        navigate('/profile');
      }
    }
  }, [navigate]);

  const handleSignupSuccess = () => {
    setShowOnboarding(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-400">RoomieMatch</h1>
          <div className="space-x-4">
            <button 
              onClick={() => setShowLoginForm(true)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Login
            </button>
            <button 
              onClick={() => setShowSignupForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Find Your Perfect Roommate
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Match with compatible roommates based on lifestyle, preferences, and more. 
            Join thousands of people finding their ideal living situation.
          </p>
          <div className="space-x-6">
            <button 
              onClick={() => setShowSignupForm(true)}
              className="bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 transition-all transform hover:scale-105 shadow-lg"
            >
              Get Started
            </button>
            <button 
              onClick={() => setShowLoginForm(true)}
              className="bg-transparent text-white px-8 py-4 rounded-lg font-semibold border-2 border-blue-500 hover:bg-blue-500/10 transition-all"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-gray-800/50 p-8 rounded-2xl backdrop-blur-sm border border-gray-700 hover:border-blue-500/50 transition-all">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-blue-400">Smart Matching</h3>
            <p className="text-gray-400">Our AI-powered algorithm finds the perfect roommate based on your preferences and lifestyle</p>
          </div>
          <div className="bg-gray-800/50 p-8 rounded-2xl backdrop-blur-sm border border-gray-700 hover:border-blue-500/50 transition-all">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-blue-400">Verified Profiles</h3>
            <p className="text-gray-400">All users are verified to ensure a safe and trustworthy community</p>
          </div>
          <div className="bg-gray-800/50 p-8 rounded-2xl backdrop-blur-sm border border-gray-700 hover:border-blue-500/50 transition-all">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-blue-400">Easy Communication</h3>
            <p className="text-gray-400">Chat with potential roommates directly through our secure platform</p>
          </div>
        </div>
      </div>

      {/* Login Form Modal */}
      {showLoginForm && <LoginForm onClose={() => setShowLoginForm(false)} />}
      
      {/* Signup Form Modal */}
      {showSignupForm && (
        <SignupForm
          onClose={() => setShowSignupForm(false)}
          onSignupSuccess={handleSignupSuccess}
        />
      )}

      {/* Onboarding Form */}
      {showOnboarding && (
        <OnboardingForm
          onComplete={() => {
            setShowOnboarding(false);
            // TODO: Navigate to matches page
          }}
        />
      )}
    </div>
  );
};

export default Landing;
