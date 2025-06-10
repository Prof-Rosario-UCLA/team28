import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MatchCard from '../components/MatchCard';
import {sendLike, getLikes} from '../services/likesService';
import NoMatches from '../components/NoMatches';
import Loading from '../components/Loading';
import { MatchProfile } from '../types/MatchProfile';
import OfflineCard from '../components/OfflineCard';

// Mock data for past matches. this would be the user's matches' full data from MongoDB 
const mockMatches = [
  {
    id: 1,
    name: 'Hello Kitty',
    age: 25,
    occupation: 'Fashion Designer',
    location: 'Sanrio Town, CA',
    matchScore: 95,
    image: 'https://news.harvard.edu/wp-content/uploads/2014/10/hello-kitty-wallpaper-37_605.jpg',
    bio: 'Sweet and friendly fashion enthusiast who loves baking and making new friends. Looking for a clean, cozy environment to share.',
    compatibility: {
      lifestyle: 'Very Clean',
      schedule: '9-5',
      noiseLevel: 'Quiet',
    },
    interests: ['Fashion', 'Baking', 'Crafts'],
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
    matchScore: 88,
    image: 'https://i.shgcdn.com/0465384c-9563-417b-b638-517529f21c3c/-/format/auto/-/preview/3000x3000/-/quality/lighter/',
    bio: 'Passionate baker who loves creating sweet treats. Looking for a roommate who appreciates a warm, welcoming home environment.',
    compatibility: {
      lifestyle: 'Moderate',
      schedule: 'Flexible',
      noiseLevel: 'Moderate',
    },
    interests: ['Baking', 'Cooking', 'Gardening'],
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
    occupation: 'Cafe Owner',
    location: 'Sanrio Town, CA',
    matchScore: 82,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTR6QL1cfQM1LXN5qavJ1IsQDJV83MMHn-ZKg&s',
    bio: 'Cafe owner who loves creating a cozy atmosphere. Prefers a peaceful, organized space with lots of natural light.',
    compatibility: {
      lifestyle: 'Very Clean',
      schedule: '9-5',
      noiseLevel: 'Quiet',
    },
    interests: ['Coffee', 'Interior Design', 'Photography'],
    contact: {
      email: 'cinnamoroll@sanrio.com',
      phone: '(555) 345-6789',
      instagram: '@cinnamoroll_official'
    }
  },
  {
    id: 4,
    name: 'Keroppi',
    age: 26,
    occupation: 'Environmental Scientist',
    location: 'Sanrio Town, CA',
    matchScore: 78,
    image: 'https://files.merca20.com/uploads/2024/11/KEROPPI-SANRIO-2024.jpg',
    bio: 'Nature lover and environmental scientist who enjoys outdoor activities. Looking for a roommate who shares a passion for sustainability.',
    compatibility: {
      lifestyle: 'Moderate',
      schedule: 'Flexible',
      noiseLevel: 'Moderate',
    },
    interests: ['Nature', 'Sports', 'Science'],
    contact: {
      email: 'keroppi@sanrio.com',
      phone: '(555) 456-7890',
      instagram: '@keroppi_official'
    }
  },
  {
    id: 5,
    name: 'Pompompurin',
    age: 25,
    occupation: 'Chef',
    location: 'Sanrio Town, CA',
    matchScore: 75,
    image: 'https://i.shgcdn.com/b613badd-3986-4479-9176-6322a7d9192f/-/format/auto/-/preview/3000x3000/-/quality/lighter/',
    bio: 'Professional chef who loves creating delicious meals. Looking for a roommate who enjoys good food and a clean kitchen.',
    compatibility: {
      lifestyle: 'Very Clean',
      schedule: 'Flexible',
      noiseLevel: 'Moderate',
    },
    interests: ['Cooking', 'Food', 'Travel'],
    contact: {
      email: 'pompompurin@sanrio.com',
      phone: '(555) 567-8901',
      instagram: '@pompompurin_official'
    }
  }
];

const Likes = () => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<MatchProfile | null>(null);
  const [showContact, setShowContact] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (!navigator.onLine) {
      setIsOffline(true);
      setLoading(false);
      return;
    }
    getLikes(localStorage.getItem('token') || '')
      .then((profiles) => {
        setLoading(false);
        console.log("Loaded likes:", profiles);
        setLikes(profiles);
      })
      .catch((err) => {
        console.error("Error loading likes:", err);
      });
  }, []);

  const handleEditProfile = () => {
    navigate('/profile');
  };

  const handleMessage = (match) => {
    setSelectedMatch(match);
    setShowContact(true);
  };

  const handleViewProfile = (match) => {
    setSelectedMatch(match);
    setShowProfile(true);
  };

  //when matching with someone who likes you, sendLike matches if other person has already liked you
  const handleMatch = (matchedName : string, likedUserId : string) => {
    sendLike(likedUserId, localStorage.getItem('token') || '')
      .then(() => {
        alert('You have successfully matched with ' + matchedName);
        setShowProfile(false);
        setSelectedMatch(null);
      })
      setLikes((prevLikes) => prevLikes.filter((match) => match._id !== likedUserId));
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar 
        isAuthenticated={true} 
      />

      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Your Match History</h1>
            </div>

            {/* Matches Grid */}
            {isOffline && likes.length === 0 ? (
              <OfflineCard />
            ) : loading ? (
              <Loading />
            ) : likes.length === 0 ? (
              <NoMatches isMatch={false} />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {likes.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onViewProfile={handleViewProfile}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Info Modal */}
      {showContact && selectedMatch && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowContact(false)}
        >
          <div 
            className="bg-gray-800 rounded-2xl p-8 w-full max-w-md relative mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowContact(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Email</p>
                <p className="font-medium">{selectedMatch.contact.email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Phone</p>
                <p className="font-medium">{selectedMatch.contact.phone}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Instagram</p>
                <p className="font-medium">{selectedMatch.contact.instagram}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Profile Modal */}
      {showProfile && selectedMatch && (
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
                src={selectedMatch.image}
                alt={selectedMatch.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold mb-1">{selectedMatch.name}</h2>
                <p className="text-gray-400">{selectedMatch.occupation}</p>
                <p className="text-gray-400">{selectedMatch.location}</p>
              </div>
            </div>

            <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">About</h3>
                <p className="text-gray-300">{selectedMatch.bio}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Living Preferences</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Cleanliness</p>
                    <p className="font-medium">{selectedMatch.lifestyle}</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Noise Level</p>
                    <p className="font-medium">{selectedMatch.noiseLevel}</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Schedule</p>
                    <p className="font-medium">{selectedMatch.schedule}</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Guests</p>
                    <p className="font-medium">Occasional</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Lifestyle & Habits</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Smoking</p>
                    <p className="font-medium">Non-smoker</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Pets</p>
                    <p className="font-medium">No pets</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Cooking</p>
                    <p className="font-medium">Frequently</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Social Life</p>
                    <p className="font-medium">Balanced</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Interests & Activities</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMatch.interests.map((interest) => (
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
                    Looking for a roommate who values cleanliness and quiet study time. 
                    Prefer to keep common areas organized and enjoy cooking together occasionally.
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  onClick={() => {
                    handleMatch( selectedMatch.name.toString() , selectedMatch._id.toString())
                  }}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Match
                </button>
                <button
                  onClick={() => {
                    setShowProfile(false);
                    setShowContact(true);
                  }}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  View Contact Info
                </button>
                <button
                  onClick={() => setShowProfile(false)}
                  className="px-6 py-3 text-gray-300 hover:text-white transition-colors"
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

export default Likes;