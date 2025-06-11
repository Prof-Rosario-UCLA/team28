import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MatchCard from '../components/MatchCard';
import {sendLike, getLikes} from '../services/likesService';
import NoMatches from '../components/NoMatches';
import Loading from '../components/Loading';
import { MatchProfile } from '../types/MatchProfile';
import OfflineCard from '../components/OfflineCard';
const DefaultProfile = '/defaultProfile.jpg';

// Mock data for past matches. this would be the user's matches' full data from MongoDB 

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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
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
                  {selectedMatch.name[0]}{selectedMatch.name[1]}
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-bold mb-1">{selectedMatch.name}</h2>
                  <p className="text-sm sm:text-base text-gray-400">{selectedMatch.occupation}</p>
                  <p className="text-sm sm:text-base text-gray-400">{selectedMatch.location}</p>
                  <p className="text-xs sm:text-sm text-blue-400 mt-1">
                    Match Score: {(selectedMatch.matchScore * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 pt-4 sm:pt-6">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-2">About</h3>
                  <p className="text-sm sm:text-base text-gray-300">{selectedMatch.bio}</p>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-2">Living Preferences</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                      <p className="text-gray-400 text-xs sm:text-sm mb-1">Room Type</p>
                      <p className="text-sm sm:text-base font-medium capitalize">{selectedMatch.roomType}</p>
                    </div>
                    <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                      <p className="text-gray-400 text-xs sm:text-sm mb-1">Lease Length</p>
                      <p className="text-sm sm:text-base font-medium">{selectedMatch.leaseLength}</p>
                    </div>
                    <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                      <p className="text-gray-400 text-xs sm:text-sm mb-1">Cleanliness</p>
                      <p className="text-sm sm:text-base font-medium capitalize">{selectedMatch.cleanliness}</p>
                    </div>
                    <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                      <p className="text-gray-400 text-xs sm:text-sm mb-1">Noise Level</p>
                      <p className="text-sm sm:text-base font-medium capitalize">{selectedMatch.noiseLevel}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-2">Lifestyle & Habits</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                      <p className="text-gray-400 text-xs sm:text-sm mb-1">Smoking</p>
                      <p className="text-sm sm:text-base font-medium capitalize">{selectedMatch.smoking}</p>
                    </div>
                    <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                      <p className="text-gray-400 text-xs sm:text-sm mb-1">Pets</p>
                      <p className="text-sm sm:text-base font-medium capitalize">{selectedMatch.pets}</p>
                    </div>
                    <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                      <p className="text-gray-400 text-xs sm:text-sm mb-1">Work Schedule</p>
                      <p className="text-sm sm:text-base font-medium">{selectedMatch.workSchedule}</p>
                    </div>
                    <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                      <p className="text-gray-400 text-xs sm:text-sm mb-1">Guests</p>
                      <p className="text-sm sm:text-base font-medium capitalize">{selectedMatch.guests}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-2">Interests & Activities</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMatch.interests.map((interest) => (
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
                      {selectedMatch.additionalNotes}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer - Fixed */}
            <div className="p-4 sm:p-8 pt-3 sm:pt-4 border-t border-gray-700 flex-shrink-0">
              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-2">
                <button
                 onClick={() => {
                    handleMatch( selectedMatch.name.toString() , selectedMatch._id.toString())
                  }}
                  className="px-4 py-2.5 sm:px-6 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
                >
                  Match
                </button>
                <button
                  onClick={() => {
                    setShowProfile(false);
                    setShowContact(true);
                  }}
                  className="px-4 py-2.5 sm:px-6 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
                >
                  View Contact Info
                </button>
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


export default Likes;