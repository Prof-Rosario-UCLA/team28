import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { sendLike } from '../services/likesService'; // Adjust the import path as necessary
import OfflineCard from '../components/OfflineCard';  

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
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch potential matches when component mounts
  useEffect(() => {
    if (!navigator.onLine) {
      setIsOffline(true);
      setIsLoading(false);
      return;
    }
    

    const fetchPotentialMatches = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }

        const response = await fetch('/api/potential', {
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
        if (err.message === 'You have already liked this user') {
          if (currentMatchIndex < potentialMatches.length - 1) {
            setCurrentMatchIndex(prev => prev + 1);
          }
        }
      });
  };

  const handleNotInterested = () => {
    // Move to next potential match
    setCurrentMatchIndex(prev => prev + 1);
  };

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    // Set the drag image to be the card itself
    const card = e.currentTarget as HTMLElement;
    e.dataTransfer.setDragImage(card, card.offsetWidth / 2, card.offsetHeight / 2);
    // Set data to identify the card
    e.dataTransfer.setData('text/plain', potentialMatches[currentMatchIndex]._id);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // needed to allow dropping
  };

  const handleDrop = (e: React.DragEvent, action: 'like' | 'reject') => {
    // calls handle like func if its a like, otherwise calls handle not interested
    e.preventDefault();
    setIsDragging(false);
    
    if (action === 'like') {
      handleLike(potentialMatches[currentMatchIndex]._id);
    } else {
      handleNotInterested();
    }
  };

  if(isOffline){
    <div className="h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">
        <Navbar isAuthenticated={true} />
        <OfflineCard/>
      </div>
  }

  if (isLoading) {
    return (
      <div className="h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">
        <Navbar isAuthenticated={true} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Loading Matches...</h2>
            <p className="text-gray-400">Please wait while we find your perfect roommate matches.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">
        <Navbar isAuthenticated={true} />
        <div className="flex-1 flex items-center justify-center">
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
      </div>
    );
  }

  if (potentialMatches.length === 0) {
    return (
      <div className="h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">
        <Navbar isAuthenticated={true} />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-700 max-w-2xl">
            <div className="text-center">
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

  if (currentMatchIndex >= potentialMatches.length) {
    return (
      <div className="h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">
        <Navbar isAuthenticated={true} />
        
        <div className="flex-1 flex flex-col px-4 overflow-y-auto">
          <div className="max-w-6xl mx-auto w-full">
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Find Your Perfect Roommate
              </h1>
            </div>
            
            {/* Desktop Layout */}
            <div className="hidden md:flex items-center justify-center mb-8">
              <div className="w-1/3 bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-700 shadow-lg mx-12">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-gray-600 to-gray-500 flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Out of Profiles</h2>
                  <p className="text-gray-400 mb-6">You've seen all available matches for now.</p>
                  <button
                    onClick={() => setCurrentMatchIndex(0)}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Review Old Matches
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden mb-8">
              <div className="mb-6 px-4">
                <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700 shadow-lg">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-gray-600 to-gray-500 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                    </div>
                    <h2 className="text-xl font-bold mb-3">Out of Profiles</h2>
                    <p className="text-gray-400 text-sm mb-4">You've seen all available matches for now.</p>
                    <button
                      onClick={() => setCurrentMatchIndex(0)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      Review Old Matches
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="text-center">
              <p className="text-gray-400">Check back later for new matches, or review previous profiles above.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col ">
      <Navbar isAuthenticated={true} />
      
      {/* Main content area - fixed height, no scrolling */}
      <div className="flex-1 flex flex-col px-4 overflow-y-auto">
        <div className="max-w-6xl mx-auto w-full">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Find Your Perfect Roommate
            </h1>
          </div>
          
          {/* Desktop: Drag zones and card */}
          <div className="hidden md:flex items-center justify-between mb-8">
            <div
              id="reject-zone"
              className="w-1/4 h-48 bg-red-500/20 rounded-2xl border-2 border-red-500 flex items-center justify-center transform hover:scale-105 transition-transform hover:bg-red-500/30"
              onClick={() => handleNotInterested()}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'reject')}
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
              onDragEnd={handleDragEnd}
              className={`w-1/3 bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-700 cursor-move shadow-lg mx-12
                ${isDragging ? 'opacity-50' : 'hover:shadow-xl transition-all duration-300 hover:border-blue-500'}`}
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
              onClick={() => handleLike(currentMatch._id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'like')}
            >
              <div className="text-center p-6">
                <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-500 font-bold text-xl">Interested</span>
              </div>
            </div>
          </div>

          {/* Mobile */}
          <div className="md:hidden mb-8">
            {/* Card */}
            <div className="mb-6 px-4">
              <div
                className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-500"
                onClick={() => setShowProfile(true)}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-2xl font-bold">
                      {currentMatch.name[0]}{currentMatch.name[1]}
                    </div>
                  </div>
                  <h2 className="text-xl font-bold mb-2">{currentMatch.name}</h2>
                  <p className="text-gray-300 text-base mb-1">{currentMatch.profile.occupation}</p>
                  <p className="text-gray-400 text-sm">{currentMatch.profile.location}</p>
                  <div className="mt-3 flex flex-wrap gap-2 justify-center">
                    {currentMatch.profile.interests.slice(0, 3).map((interest) => (
                      <span
                        key={interest}
                        className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 text-sm text-gray-400">
                    Match Score: {(currentMatch.similarity * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4 px-8">
              <button 
                onClick={() => handleNotInterested()}
                className="flex-1 bg-red-500/20 border-2 border-red-500 text-red-500 py-4 rounded-xl font-bold text-lg hover:bg-red-500/30 transition-colors active:scale-95 flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Pass
              </button>
              <button 
                onClick={() => handleLike(currentMatch._id)}
                className="flex-1 bg-green-500/20 border-2 border-green-500 text-green-500 py-4 rounded-xl font-bold text-lg hover:bg-green-500/30 transition-colors active:scale-95 flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Like
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center">
            <p className="text-gray-300 text-xl mb-3 font-medium hidden md:block">
              Drag the card left to reject, or right to accept!
            </p>
            <p className="text-gray-300 text-lg mb-3 font-medium md:hidden">
              Tap the buttons below to pass or like!
            </p>
            <p className="text-gray-400">You can click the card to view full profile</p>
          </div>
        </div>
      </div>

      {/* Full profile modal */}
      {showProfile && currentMatch && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowProfile(false)}
        >
          <div 
            className="bg-gray-800 rounded-2xl w-full max-w-2xl mx-4 h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header - Fixed */}
            <div className="p-4 sm:p-8 pb-3 sm:pb-4 border-b border-gray-700 flex-shrink-0">
              <button
                onClick={() => setShowProfile(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-2xl sm:text-3xl font-bold mx-auto sm:mx-0">
                  {currentMatch.name[0]}{currentMatch.name[1]}
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-bold mb-1">{currentMatch.name}</h2>
                  <p className="text-sm sm:text-base text-gray-400">{currentMatch.profile.occupation}</p>
                  <p className="text-sm sm:text-base text-gray-400">{currentMatch.profile.location}</p>
                  <p className="text-xs sm:text-sm text-blue-400 mt-1">
                    Match Score: {(currentMatch.similarity * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 pt-4 sm:pt-6">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-2">About</h3>
                  <p className="text-sm sm:text-base text-gray-300">{currentMatch.profile.bio}</p>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-2">Living Preferences</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                      <p className="text-gray-400 text-xs sm:text-sm mb-1">Room Type</p>
                      <p className="text-sm sm:text-base font-medium capitalize">{currentMatch.profile.roomType}</p>
                    </div>
                    <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                      <p className="text-gray-400 text-xs sm:text-sm mb-1">Lease Length</p>
                      <p className="text-sm sm:text-base font-medium">{currentMatch.profile.leaseLength}</p>
                    </div>
                    <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                      <p className="text-gray-400 text-xs sm:text-sm mb-1">Cleanliness</p>
                      <p className="text-sm sm:text-base font-medium capitalize">{currentMatch.profile.cleanliness}</p>
                    </div>
                    <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                      <p className="text-gray-400 text-xs sm:text-sm mb-1">Noise Level</p>
                      <p className="text-sm sm:text-base font-medium capitalize">{currentMatch.profile.noiseLevel}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-2">Lifestyle & Habits</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                      <p className="text-gray-400 text-xs sm:text-sm mb-1">Smoking</p>
                      <p className="text-sm sm:text-base font-medium capitalize">{currentMatch.profile.smoking}</p>
                    </div>
                    <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                      <p className="text-gray-400 text-xs sm:text-sm mb-1">Pets</p>
                      <p className="text-sm sm:text-base font-medium capitalize">{currentMatch.profile.pets}</p>
                    </div>
                    <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                      <p className="text-gray-400 text-xs sm:text-sm mb-1">Work Schedule</p>
                      <p className="text-sm sm:text-base font-medium">{currentMatch.profile.workSchedule}</p>
                    </div>
                    <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                      <p className="text-gray-400 text-xs sm:text-sm mb-1">Guests</p>
                      <p className="text-sm sm:text-base font-medium capitalize">{currentMatch.profile.guests}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-2">Interests & Activities</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentMatch.profile.interests.map((interest) => (
                      <span
                        key={interest}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-500/20 text-blue-400 rounded-full text-xs sm:text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-2">Additional Notes</h3>
                  <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                    <p className="text-sm sm:text-base text-gray-300">
                      {currentMatch.profile.additionalNotes}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer - Fixed */}
            <div className="p-4 sm:p-8 pt-3 sm:pt-4 border-t border-gray-700 flex-shrink-0">
              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-2">
                <button
                  onClick={() => setShowProfile(false)}
                  className="px-4 py-2.5 sm:px-6 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
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