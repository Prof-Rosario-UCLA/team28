import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MatchCard from '../components/MatchCard';
import { getMatches } from '../services/matchService';
import NoMatches from '../components/NoMatches';
import Loading from '../components/Loading';
import { MatchProfile } from '../types/MatchProfile';
import OfflineCard from '../components/OfflineCard';
const DefaultProfile = '/defaultProfile.jpg';



const Matches = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<any[]>([]);
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
    

    getMatches(localStorage.getItem('token') || '')
      .then((profiles) => {
        setLoading(false);
        console.log("Loaded matches:", profiles);
        setMatches(profiles);
      })
      .catch((err) => {
        console.error("Error loading matches:", err);
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

  //when matching with someone who likes you, sendLike matches if other person has already liked yo
  
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar 
        isAuthenticated={true} 
      />
      
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-3xl font-bold mb-2">Your Match History</h1>
            </div>

            {/* Matches Grid */}
            {isOffline && matches.length === 0 ? (
              <OfflineCard />
            ) : loading ? (
              <Loading />
            ) : matches.length === 0 ? (
              <NoMatches isMatch={false} />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {matches.map((match) => (
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 py-8"
          onClick={() => setShowContact(false)}
        >
          <div 
            className="bg-gray-800 rounded-2xl p-6 sm:p-8 w-full max-w-md relative mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowContact(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6">Contact Information</h2>
            
            <div className="space-y-3 sm:space-y-4">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm mb-1">Email</p>
                <p className="font-medium text-sm sm:text-base">{selectedMatch.contact.email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs sm:text-sm mb-1">Phone</p>
                <p className="font-medium text-sm sm:text-base">{selectedMatch.contact.phone}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs sm:text-sm mb-1">Instagram</p>
                <p className="font-medium text-sm sm:text-base">{selectedMatch.contact.instagram}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Profile Modal */}
      {showProfile && selectedMatch && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 py-8"
          onClick={() => setShowProfile(false)}
        >
          <div 
            className="bg-gray-800 rounded-2xl p-6 sm:p-8 w-full max-w-2xl relative mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowProfile(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-center space-x-4 sm:space-x-6 mb-6 sm:mb-8">
              <img
                src={selectedMatch.image || DefaultProfile}
                alt={selectedMatch.name}
                className="w-16 h-16 sm:w-24 sm:h-24 rounded-full object-cover"
              />
              <div>
                <h2 className="text-lg sm:text-2xl font-bold mb-1">{selectedMatch.name}</h2>
                <p className="text-gray-400 text-sm sm:text-base">{selectedMatch.occupation}</p>
                <p className="text-gray-400 text-sm sm:text-base">{selectedMatch.location}</p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-2">About</h3>
                <p className="text-gray-300 text-sm sm:text-base">{selectedMatch.bio}</p>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-2">Living Preferences</h3>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                    <p className="text-gray-400 text-xs sm:text-sm mb-1">Cleanliness</p>
                    <p className="font-medium text-sm sm:text-base">{selectedMatch.lifestyle}</p>
                  </div>
                  <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                    <p className="text-gray-400 text-xs sm:text-sm mb-1">Noise Level</p>
                    <p className="font-medium text-sm sm:text-base">{selectedMatch.noiseLevel}</p>
                  </div>
                  <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                    <p className="text-gray-400 text-xs sm:text-sm mb-1">Schedule</p>
                    <p className="font-medium text-sm sm:text-base">{selectedMatch.schedule}</p>
                  </div>
                  <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                    <p className="text-gray-400 text-xs sm:text-sm mb-1">Guests</p>
                    <p className="font-medium text-sm sm:text-base">Occasional</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-2">Lifestyle & Habits</h3>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                    <p className="text-gray-400 text-xs sm:text-sm mb-1">Smoking</p>
                    <p className="font-medium text-sm sm:text-base">Non-smoker</p>
                  </div>
                  <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                    <p className="text-gray-400 text-xs sm:text-sm mb-1">Pets</p>
                    <p className="font-medium text-sm sm:text-base">No pets</p>
                  </div>
                  <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                    <p className="text-gray-400 text-xs sm:text-sm mb-1">Cooking</p>
                    <p className="font-medium text-sm sm:text-base">Frequently</p>
                  </div>
                  <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                    <p className="text-gray-400 text-xs sm:text-sm mb-1">Social Life</p>
                    <p className="font-medium text-sm sm:text-base">Balanced</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-2">Interests & Activities</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMatch.interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm sm:text-base"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-2">Additional Notes</h3>
                <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                  <p className="text-gray-300 text-sm sm:text-base">
                    Looking for a roommate who values cleanliness and quiet study time. 
                    Prefer to keep common areas organized and enjoy cooking together occasionally.
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 sm:space-x-4 pt-4 sm:pt-6">
                <button
                  onClick={() => {
                    setShowProfile(false);
                    setShowContact(true);
                  }}
                  className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
                >
                  <span className="hidden sm:inline">View Contact Info</span>
                  <span className="sm:hidden">Contact</span>
                </button>
                <button
                  onClick={() => setShowProfile(false)}
                  className="px-4 py-2 sm:px-6 sm:py-3 text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
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

export default Matches; 