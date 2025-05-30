import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

// Mock data for potential matches
const mockPotentialMatches = [
  {
    id: 1,
    name: 'Hello Kitty',
    age: 25,
    occupation: 'Fashion Designer',
    location: 'Sanrio Town, CA',
    image: 'https://news.harvard.edu/wp-content/uploads/2014/10/hello-kitty-wallpaper-37_605.jpg',
    bio: 'Sweet and friendly fashion enthusiast who loves baking and making new friends.',
    interests: ['Fashion', 'Baking', 'Crafts'],
    compatibility: {
      lifestyle: 'Very Clean',
      schedule: '9-5',
      noiseLevel: 'Quiet',
      guests: 'Occasional'
    },
    lifestyle: {
      smoking: 'Non-smoker',
      pets: 'No pets',
      cooking: 'Frequently',
      socialLife: 'Balanced'
    },
    additionalNotes: 'Looking for a roommate who values cleanliness and quiet study time. Prefer to keep common areas organized and enjoy cooking together occasionally.',
    contact: {
      email: 'hello.kitty@sanrio.com',
      phone: '(555) 123-4567',
      instagram: '@hellokitty_official'
    }
  },
  {
    id: 2,
    name: 'My Melody',
    age: 24,
    occupation: 'Baker',
    location: 'Sanrio Town, CA',
    image: 'https://i.shgcdn.com/0465384c-9563-417b-b638-517529f21c3c/-/format/auto/-/preview/3000x3000/-/quality/lighter/',
    bio: 'Passionate baker who loves creating sweet treats.',
    interests: ['Baking', 'Cooking', 'Gardening'],
    compatibility: {
      lifestyle: 'Moderate',
      schedule: 'Flexible',
      noiseLevel: 'Moderate',
      guests: 'Sometimes'
    },
    lifestyle: {
      smoking: 'Non-smoker',
      pets: 'Open to pets',
      cooking: 'Daily',
      socialLife: 'Very Social'
    },
    additionalNotes: 'Love to bake and share treats with roommates. Looking for someone who loves to eat!',
    contact: {
      email: 'my.melody@sanrio.com',
      phone: '(555) 234-5678',
      instagram: '@mymelody_official'
    }
  },
  {
    id: 3,
    name: 'Cinnamoroll',
    age: 23,
    occupation: 'Barista',
    location: 'Cafe Town, CA',
    image: 'https://i.pinimg.com/originals/8c/4c/3d/8c4c3d9c9c9c9c9c9c9c9c9c9c9c9c9c9.jpg',
    bio: 'Coffee enthusiast and social butterfly who loves meeting new people.',
    interests: ['Coffee', 'Photography', 'Travel'],
    compatibility: {
      lifestyle: 'Moderate',
      schedule: 'Flexible',
      noiseLevel: 'Social',
      guests: 'Often'
    },
    lifestyle: {
      smoking: 'Non-smoker',
      pets: 'Has a cat',
      cooking: 'Sometimes',
      socialLife: 'Very Social'
    },
    additionalNotes: 'Looking for a roommate who enjoys social gatherings and coffee chats. I work at a cafe and love hosting small get-togethers.',
    contact: {
      email: 'cinnamoroll@sanrio.com',
      phone: '(555) 345-6789',
      instagram: '@cinnamoroll_official'
    }
  },
  {
    id: 4,
    name: 'Pompompurin',
    age: 26,
    occupation: 'Software Engineer',
    location: 'San Francisco, CA',
    image: 'https://i.pinimg.com/originals/9c/4c/3d/9c4c3d9c9c9c9c9c9c9c9c9c9c9c9c9c9.jpg',
    bio: 'I am an introvert who enjoys quiet evenings.',
    interests: ['Coding', 'Gaming', 'Reading'],
    compatibility: {
      lifestyle: 'Very Clean',
      schedule: '9-5',
      noiseLevel: 'Quiet',
      guests: 'Rarely'
    },
    lifestyle: {
      smoking: 'Non-smoker',
      pets: 'No pets',
      cooking: 'Basic',
      socialLife: 'Quiet'
    },
    additionalNotes: 'Prefer a quiet environment for work and study. Looking for someone who respects personal space.',
    contact: {
      email: 'pompompurin@sanrio.com',
      phone: '(555) 456-7890',
      instagram: '@pompompurin_official'
    }
  },
  {
    id: 5,
    name: 'Kuromi',
    age: 24,
    occupation: 'Artist',
    location: 'Arts District, CA',
    image: 'https://i.pinimg.com/originals/7c/4c/3d/7c4c3d9c9c9c9c9c9c9c9c9c9c9c9c9c9.jpg',
    bio: 'Creative soul who loves expressing through art and music.',
    interests: ['Art', 'Music', 'Fashion'],
    compatibility: {
      lifestyle: 'Moderate',
      schedule: 'Flexible',
      noiseLevel: 'Moderate',
      guests: 'Sometimes'
    },
    lifestyle: {
      smoking: 'Non-smoker',
      pets: 'Has a dog',
      cooking: 'Sometimes',
      socialLife: 'Balanced'
    },
    additionalNotes: 'Looking for a roommate who appreciates art and creativity. I often work on projects at home and might have art supplies around.',
    contact: {
      email: 'kuromi@sanrio.com',
      phone: '(555) 567-8901',
      instagram: '@kuromi_official'
    }
  },
  {
    id: 6,
    name: 'Keroppi',
    age: 25,
    occupation: 'Environmental Scientist',
    location: 'Green Valley, CA',
    image: 'https://i.pinimg.com/originals/6c/4c/3d/6c4c3d9c9c9c9c9c9c9c9c9c9c9c9c9c9.jpg',
    bio: 'Nature lover and outdoor enthusiast who enjoys hiking and environmental conservation.',
    interests: ['Hiking', 'Gardening', 'Photography'],
    compatibility: {
      lifestyle: 'Moderate',
      schedule: 'Flexible',
      noiseLevel: 'Moderate',
      guests: 'Sometimes'
    },
    lifestyle: {
      smoking: 'Non-smoker',
      pets: 'Open to pets',
      cooking: 'Frequently',
      socialLife: 'Balanced'
    },
    additionalNotes: 'Looking for a roommate who shares a love for nature and sustainability. I enjoy growing plants and maintaining a green living space.',
    contact: {
      email: 'keroppi@sanrio.com',
      phone: '(555) 678-9012',
      instagram: '@keroppi_official'
    }
  }
];

// main component for the potential matches page
const PotentialMatches = () => {
  const navigate = useNavigate();
  const [currentMatch, setCurrentMatch] = useState(mockPotentialMatches[0]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [showProfile, setShowProfile] = useState(false);
  const [noMoreMatches, setNoMoreMatches] = useState(false);

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

  // handles when the user drops the card in the accept or reject zone
  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    
    // move to next potential match
    const currentIndex = mockPotentialMatches.findIndex(match => match.id === currentMatch.id);
    if (currentIndex < mockPotentialMatches.length - 1) {
      setCurrentMatch(mockPotentialMatches[currentIndex + 1]);
    } else {
      setNoMoreMatches(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar isAuthenticated={true} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Find Your Perfect Roommate
          </h1>
          
          {/* when the user has no more potential matches, show this */}
          {noMoreMatches ? (
            <div className="text-center py-16">
              <div className="bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-700 max-w-2xl mx-auto">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h2 className="text-2xl font-bold mb-4">No More Matches</h2>
                <p className="text-gray-400 mb-6">You've swiped through all of your potential matches for now. You should refresh your page for more matches!</p>
                <button
                  onClick={() => navigate('/matches')}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  View My Matches
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* drop zones and card container */}
              <div className="flex items-center justify-between mb-12 px-4">
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

                {/* current potential match card */}
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
                      <img
                        src={currentMatch.image}
                        alt={currentMatch.name}
                        className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                      />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{currentMatch.name}</h2>
                    <p className="text-gray-300 text-lg mb-1">{currentMatch.occupation}</p>
                    <p className="text-gray-400">{currentMatch.location}</p>
                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                      {currentMatch.interests.slice(0, 3).map((interest) => (
                        <span
                          key={interest}
                          className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div
                  id="accept-zone"
                  className="w-1/4 h-48 bg-green-500/20 rounded-2xl border-2 border-green-500 flex items-center justify-center transform hover:scale-105 transition-transform hover:bg-green-500/30"
                >
                  <div className="text-center p-6">
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
            </>
          )}
        </div>
      </div>

      {/* display the full profile of the current potential match (except for contact info), upon clicking the card */}
      {showProfile && currentMatch && !noMoreMatches && (
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
              <img
                src={currentMatch.image}
                alt={currentMatch.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold mb-1">{currentMatch.name}</h2>
                <p className="text-gray-400">{currentMatch.occupation}</p>
                <p className="text-gray-400">{currentMatch.location}</p>
              </div>
            </div>

            <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">About</h3>
                <p className="text-gray-300">{currentMatch.bio}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Living Preferences</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Cleanliness</p>
                    <p className="font-medium">{currentMatch.compatibility.lifestyle}</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Noise Level</p>
                    <p className="font-medium">{currentMatch.compatibility.noiseLevel}</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Schedule</p>
                    <p className="font-medium">{currentMatch.compatibility.schedule}</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Guests</p>
                    <p className="font-medium">{currentMatch.compatibility.guests}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Lifestyle & Habits</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Smoking</p>
                    <p className="font-medium">{currentMatch.lifestyle.smoking}</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Pets</p>
                    <p className="font-medium">{currentMatch.lifestyle.pets}</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Cooking</p>
                    <p className="font-medium">{currentMatch.lifestyle.cooking}</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Social Life</p>
                    <p className="font-medium">{currentMatch.lifestyle.socialLife}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Interests & Activities</h3>
                <div className="flex flex-wrap gap-2">
                  {currentMatch.interests.map((interest) => (
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
                    {currentMatch.additionalNotes}
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