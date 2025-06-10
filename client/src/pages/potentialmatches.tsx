import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { sendLike } from '../services/likesService'; // Adjust the import path as necessary

interface PotentialMatch {
  _id: string;
  name: string;
  profile: {
    age: string;
    occupation: string;
    location: string;
    bio: string;
    interests: string[];
    roomType: string;
    leaseLength: string;
    smoking: string;
    pets: string;
    cleanliness: string;
    noiseLevel: string;
    workSchedule: string;
    guests: string;
    additionalNotes: string;
    contact: {
      email: string;
      phone: string;
      instagram: string;
    };
  };
  similarity: number;
}

const PotentialMatches = () => {
  const navigate = useNavigate();
  const [potentialMatches, setPotentialMatches] = useState<PotentialMatch[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [showProfile, setShowProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch potential matches when component mounts
  useEffect(() => {
    const fetchPotentialMatches = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }

        const response = await fetch('http://localhost:3000/api/potential', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch potential matches');
        }

        const data = await response.json();
        setPotentialMatches(data);
      } catch (error) {
        console.error('Error fetching potential matches:', error);
        setError('Failed to load potential matches');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPotentialMatches();
  }, [navigate]);

  const handleLike = (likedUserId : string) => {
    sendLike(likedUserId, localStorage.getItem('token') || '')
      .then(() => {
        console.log('Like sent successfully');
        if (currentMatchIndex < potentialMatches.length - 1) {
          setCurrentMatchIndex(prev => prev + 1);
        }
      })
      .catch((err) => {
        console.error("Error liking:", err);
      });
  };

  const handleNotInterested = () => {
    // Move to next potential match
    if (currentMatchIndex < potentialMatches.length - 1) {
      setCurrentMatchIndex(prev => prev + 1);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    setDragPosition({
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    if (isDragging) {
      setDragPosition({
        x: e.clientX,
        y: e.clientY
      });
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    
    // Move to next potential match
    if (currentMatchIndex < potentialMatches.length - 1) {
      setCurrentMatchIndex(prev => prev + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading Matches...</h2>
          <p className="text-gray-400">Please wait while we find your perfect roommate matches.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-400">Error</h2>
          <p className="text-gray-400">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (potentialMatches.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <Navbar isAuthenticated={true} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-700 max-w-2xl mx-auto">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h2 className="text-2xl font-bold mb-4">No Matches Found</h2>
              <p className="text-gray-400 mb-6">We couldn't find any potential matches for you right now. Check back later!</p>
              <button
                onClick={() => navigate('/profile')}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentMatch = potentialMatches[currentMatchIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar isAuthenticated={true} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Find Your Perfect Roommate
          </h1>
          
          {/* Drop zones and card container */}
          <div className="flex items-center justify-between mb-12 px-4" onClick={() => handleNotInterested()}>
            <div
              id="reject-zone"
              className="w-1/4 h-48 bg-red-500/20 rounded-2xl border-2 border-red-500 flex items-center justify-center transform hover:scale-105 transition-transform hover:bg-red-500/30"
            >
              <div className="text-center p-6">
                <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-red-500 font-bold text-xl">Not Interested</span>
              </div>
            </div>

            {/* Current potential match card */}
            <div
              draggable
              onDragStart={handleDragStart}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              className={`w-1/3 bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-700 cursor-move shadow-lg mx-12
                ${isDragging ? 'opacity-50' : 'hover:shadow-xl transition-all duration-300 hover:border-blue-500'}`}
              style={{
                transform: isDragging ? `translate(${dragPosition.x}px, ${dragPosition.y}px)` : 'none'
              }}
              onClick={() => setShowProfile(true)}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-3xl font-bold">
                    {currentMatch.name[0]}{currentMatch.name[1]}
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">{currentMatch.name}</h2>
                <p className="text-gray-300 text-lg mb-1">{currentMatch.profile.occupation}</p>
                <p className="text-gray-400">{currentMatch.profile.location}</p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {currentMatch.profile.interests.slice(0, 3).map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
                <div className="mt-4 text-sm text-gray-400">
                  Match Score: {(currentMatch.similarity * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            <div
              id="accept-zone"
              className="w-1/4 h-48 bg-green-500/20 rounded-2xl border-2 border-green-500 flex items-center justify-center transform hover:scale-105 transition-transform hover:bg-green-500/30"
            >
              <div className="text-center p-6" onClick={() => handleLike(currentMatch._id)}>
                <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-500 font-bold text-xl">Interested</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-16 text-center">
            <p className="text-gray-300 text-xl mb-3 font-medium">Drag the card left to reject, or right to accept!</p>
            <p className="text-gray-400">You can click the card to view full profile</p>
          </div>
        </div>
      </div>

      {/* Full profile modal */}
      {showProfile && currentMatch && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto py-8"
          onClick={() => setShowProfile(false)}
        >
          <div 
            className="bg-gray-800 rounded-2xl p-8 w-full max-w-2xl relative mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowProfile(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-center space-x-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-3xl font-bold">
                {currentMatch.name[0]}{currentMatch.name[1]}
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">{currentMatch.name}</h2>
                <p className="text-gray-400">{currentMatch.profile.occupation}</p>
                <p className="text-gray-400">{currentMatch.profile.location}</p>
                <p className="text-sm text-blue-400 mt-1">
                  Match Score: {(currentMatch.similarity * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">About</h3>
                <p className="text-gray-300">{currentMatch.profile.bio}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Living Preferences</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Room Type</p>
                    <p className="font-medium capitalize">{currentMatch.profile.roomType}</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Lease Length</p>
                    <p className="font-medium">{currentMatch.profile.leaseLength}</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Cleanliness</p>
                    <p className="font-medium capitalize">{currentMatch.profile.cleanliness}</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Noise Level</p>
                    <p className="font-medium capitalize">{currentMatch.profile.noiseLevel}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Lifestyle & Habits</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Smoking</p>
                    <p className="font-medium capitalize">{currentMatch.profile.smoking}</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Pets</p>
                    <p className="font-medium capitalize">{currentMatch.profile.pets}</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Work Schedule</p>
                    <p className="font-medium">{currentMatch.profile.workSchedule}</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Guests</p>
                    <p className="font-medium capitalize">{currentMatch.profile.guests}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Interests & Activities</h3>
                <div className="flex flex-wrap gap-2">
                  {currentMatch.profile.interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Additional Notes</h3>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-gray-300">
                    {currentMatch.profile.additionalNotes}
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  onClick={() => setShowProfile(false)}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PotentialMatches; 