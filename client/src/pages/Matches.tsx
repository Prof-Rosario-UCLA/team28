import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Mock data for potential matches
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
  }
];

const Matches = () => {
  const [selectedMatch, setSelectedMatch] = useState<typeof mockMatches[0] | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-400">RoomieMatch</Link>
          <div className="space-x-4">
            <Link to="/profile" className="text-gray-300 hover:text-white transition-colors">Profile</Link>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">Logout</button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Matches</h1>
            <p className="text-gray-400">Find your perfect roommate from our curated matches</p>
          </div>

          {/* Matches Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockMatches.map((match) => (
              <div
                key={match.id}
                className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700 hover:border-blue-500/50 transition-all cursor-pointer"
                onClick={() => setSelectedMatch(match)}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={match.image}
                    alt={match.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{match.name}</h3>
                    <p className="text-gray-400">{match.occupation}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                      {match.matchScore}% Match
                    </span>
                  </div>
                </div>
                <p className="text-gray-300 mb-4 line-clamp-2">{match.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {match.interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Match Detail Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-2xl relative">
            {/* Close button */}
            <button
              onClick={() => setSelectedMatch(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Match details */}
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
              <div className="ml-auto">
                <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-lg font-semibold">
                  {selectedMatch.matchScore}% Match
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">About</h3>
                <p className="text-gray-300">{selectedMatch.bio}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Compatibility</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Lifestyle</p>
                    <p className="font-medium">{selectedMatch.compatibility.lifestyle}</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Schedule</p>
                    <p className="font-medium">{selectedMatch.compatibility.schedule}</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Noise Level</p>
                    <p className="font-medium">{selectedMatch.compatibility.noiseLevel}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Interests</h3>
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

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  onClick={() => setSelectedMatch(null)}
                  className="px-6 py-3 text-gray-300 hover:text-white transition-colors"
                >
                  Skip
                </button>
                <button className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Matches; 