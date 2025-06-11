import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const About = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // check if user is authenticated and has completed their profile
  const checkAuthAndProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // verify token + get user profile
      const response = await fetch('/api/profile/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        // if user has a profile, redirect to profile page
        if (data.profile) {
          navigate('/profile');
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
    }
  };

  // Check auth on mount
  useEffect(() => {
    checkAuthAndProfile();
  }, [navigate]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar isAuthenticated={isAuthenticated} />

      {/* Main Content */}
      <section className="flex-1 flex  ">
        <div className="max-w-4xl mx-auto px-4 text-center">
          {/* Header */}
          <h1 className="text-6xl font-bold mb-12 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Find Your Perfect Roommate
          </h1>
          
          {/* Text Content Section */}
          <article className="text-gray-300 text-lg leading-relaxed">
            <p>
                Welcome to RoomieMatch, the ultimate platform for finding your ideal roommate! Whether you're a student, young professional, or just looking for a change, RoomieMatch connects you with like-minded individuals to make your living experience enjoyable and hassle-free. 
                <br/>
                <br/>
                Created by Annesh Bothala, Lauren Liu, and Alexander Chen
            </p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default About;