import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface ProfileData {
  age: string;
  occupation: string;
  location: string;
  moveInDate: string;
  budget: string;
  preferredLocation: string;
  roomType: string;
  leaseLength: string;
  smoking: string;
  pets: string;
  cleanliness: string;
  noiseLevel: string;
  workSchedule: string;
  guests: string;
  bio: string;
  interests: string[];
  fullName: string;
  createdAt: string;
}

const Profile = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Get user data from localStorage
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      const data = JSON.parse(storedData);
      setUserData(data);
      setProfileData(data.profile);
    }
  }, []);

  if (!profileData || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading Profile...</h2>
          <p className="text-gray-400">Please wait while we load your profile data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-400">RoomieMatch</Link>
          <div className="space-x-4">
            <Link to="/matches" className="text-gray-300 hover:text-white transition-colors">Matches</Link>
            <button 
              onClick={() => {
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('userData');
                window.location.href = '/';
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-gray-800/50 rounded-2xl p-8 mb-8 backdrop-blur-sm border border-gray-700">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-3xl font-bold">
                {userData.firstName?.[0]}{userData.lastName?.[0]}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{profileData.fullName}</h1>
                <p className="text-gray-400">{profileData.occupation}</p>
                <p className="text-gray-400">{profileData.location}</p>
                <p className="text-gray-400 text-sm mt-2">
                  Member since {new Date(profileData.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* About Me */}
              <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700">
                <h2 className="text-xl font-semibold text-blue-400 mb-4">About Me</h2>
                <p className="text-gray-300">{profileData.bio}</p>
              </div>

              {/* Preferences */}
              <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700">
                <h2 className="text-xl font-semibold text-blue-400 mb-4">Living Preferences</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm">Budget</p>
                    <p className="text-white">{profileData.budget}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Preferred Location</p>
                    <p className="text-white">{profileData.preferredLocation}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Room Type</p>
                    <p className="text-white capitalize">{profileData.roomType}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Lease Length</p>
                    <p className="text-white">{profileData.leaseLength}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Quick Stats */}
              <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700">
                <h2 className="text-xl font-semibold text-blue-400 mb-4">Lifestyle</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Smoking</p>
                    <p className="text-white capitalize">{profileData.smoking}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Pets</p>
                    <p className="text-white capitalize">{profileData.pets}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Cleanliness</p>
                    <p className="text-white capitalize">{profileData.cleanliness}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Noise Level</p>
                    <p className="text-white capitalize">{profileData.noiseLevel}</p>
                  </div>
                </div>
              </div>

              {/* Interests */}
              <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700">
                <h2 className="text-xl font-semibold text-blue-400 mb-4">Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {profileData.interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Schedule */}
              <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700">
                <h2 className="text-xl font-semibold text-blue-400 mb-4">Schedule & Habits</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm">Work Schedule</p>
                    <p className="text-white">{profileData.workSchedule}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Guest Policy</p>
                    <p className="text-white capitalize">{profileData.guests}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 