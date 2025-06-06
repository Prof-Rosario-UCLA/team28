import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface ProfileData {
  age: string;
  occupation: string;
  location: string;
  moveInDate: string;
  budget: string;
  preferredLocation: string;
  roomType: 'private' | 'shared' | 'flexible';
  leaseLength: string;
  smoking: 'yes' | 'no' | 'sometimes';
  pets: 'yes' | 'no' | 'flexible';
  cleanliness: 'very clean' | 'moderate' | 'relaxed';
  noiseLevel: 'quiet' | 'moderate' | 'social';
  workSchedule: '9-5' | 'night shift' | 'flexible';
  guests: 'rarely' | 'sometimes' | 'often';
  bio: string;
  interests: string[];
  fullName: string;
  createdAt: string;
  contact: {
    email: string;
    phone: string;
    instagram: string;
  };
  additionalNotes: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile data from MongoDB
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }

        const response = await fetch('http://localhost:3000/api/profile/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Profile fetch error:', errorText);
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfileData(data.profile);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (!profileData) return;

    // Handle nested contact fields
    if (name.startsWith('contact.')) {
      const field = name.split('.')[1];
      setProfileData(prev => prev ? {
        ...prev,
        contact: { ...prev.contact, [field]: value }
      } : null);
    } else {
      setProfileData(prev => prev ? { ...prev, [name]: value } : null);
    }
  };

  const handleInterestsChange = (interest: string) => {
    if (!profileData) return;
    const newInterests = profileData.interests.includes(interest)
      ? profileData.interests.filter(i => i !== interest)
      : [...profileData.interests, interest];
    setProfileData(prev => prev ? { ...prev, interests: newInterests } : null);
  };

  const handleSave = async () => {
    if (!profileData) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await fetch('http://localhost:3000/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          profile: profileData
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Profile update error:', errorText);
        throw new Error(errorText || 'Failed to update profile');
      }

      const data = await response.json();
      setProfileData(data.profile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading Profile...</h2>
          <p className="text-gray-400">Please wait while we load your profile data.</p>
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

  if (!profileData) {
    return null;
  }

  const commonInputClasses = "w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
  const commonLabelClasses = "block text-sm font-medium text-gray-300 mb-2";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar isAuthenticated={true} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-gray-800/50 rounded-2xl p-8 mb-8 backdrop-blur-sm border border-gray-700">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-3xl font-bold">
                {profileData.fullName?.[0]}{profileData.fullName?.[1]}
              </div>
              <div className="flex-grow">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="occupation" className={commonLabelClasses}>Occupation</label>
                      <input
                        type="text"
                        id="occupation"
                        name="occupation"
                        value={profileData.occupation}
                        onChange={handleChange}
                        className={commonInputClasses}
                      />
                    </div>
                    <div>
                      <label htmlFor="location" className={commonLabelClasses}>Location</label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={profileData.location}
                        onChange={handleChange}
                        className={commonInputClasses}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start">
                      <div>
                        <h1 className="text-3xl font-bold mb-2">{profileData.fullName}</h1>
                        <p className="text-gray-400">{profileData.occupation}</p>
                        <p className="text-gray-400">{profileData.location}</p>
                        <p className="text-gray-400 text-sm mt-2">
                          Member since {new Date(profileData.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={handleEdit}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Edit Profile
                      </button>
                    </div>
                  </>
                )}
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
                {isEditing ? (
                  <div>
                    <label htmlFor="bio" className={commonLabelClasses}>Bio</label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={profileData.bio}
                      onChange={handleChange}
                      rows={4}
                      className={commonInputClasses}
                    />
                  </div>
                ) : (
                  <p className="text-gray-300">{profileData.bio}</p>
                )}
              </div>

              {/* Preferences */}
              <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700">
                <h2 className="text-xl font-semibold text-blue-400 mb-4">Living Preferences</h2>
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <div>
                        <label htmlFor="budget" className={commonLabelClasses}>Budget</label>
                        <input
                          type="text"
                          id="budget"
                          name="budget"
                          value={profileData.budget}
                          onChange={handleChange}
                          className={commonInputClasses}
                        />
                      </div>
                      <div>
                        <label htmlFor="preferredLocation" className={commonLabelClasses}>Preferred Location</label>
                        <input
                          type="text"
                          id="preferredLocation"
                          name="preferredLocation"
                          value={profileData.preferredLocation}
                          onChange={handleChange}
                          className={commonInputClasses}
                        />
                      </div>
                      <div>
                        <label htmlFor="roomType" className={commonLabelClasses}>Room Type</label>
                        <select
                          id="roomType"
                          name="roomType"
                          value={profileData.roomType}
                          onChange={handleChange}
                          className={commonInputClasses}
                        >
                          <option value="private">Private Room</option>
                          <option value="shared">Shared Room</option>
                          <option value="flexible">Flexible</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="leaseLength" className={commonLabelClasses}>Lease Length</label>
                        <select
                          id="leaseLength"
                          name="leaseLength"
                          value={profileData.leaseLength}
                          onChange={handleChange}
                          className={commonInputClasses}
                        >
                          <option value="3 months">3 months</option>
                          <option value="6 months">6 months</option>
                          <option value="12 months">12 months</option>
                          <option value="flexible">Flexible</option>
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700">
                <h2 className="text-xl font-semibold text-blue-400 mb-4">Contact Information</h2>
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <div>
                        <label htmlFor="contact.email" className={commonLabelClasses}>Email</label>
                        <input
                          type="email"
                          id="contact.email"
                          name="contact.email"
                          value={profileData.contact.email}
                          onChange={handleChange}
                          className={commonInputClasses}
                        />
                      </div>
                      <div>
                        <label htmlFor="contact.phone" className={commonLabelClasses}>Phone Number</label>
                        <input
                          type="tel"
                          id="contact.phone"
                          name="contact.phone"
                          value={profileData.contact.phone}
                          onChange={handleChange}
                          className={commonInputClasses}
                        />
                      </div>
                      <div>
                        <label htmlFor="contact.instagram" className={commonLabelClasses}>Instagram Handle</label>
                        <input
                          type="text"
                          id="contact.instagram"
                          name="contact.instagram"
                          value={profileData.contact.instagram}
                          onChange={handleChange}
                          className={commonInputClasses}
                          placeholder="@username"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-gray-400 text-sm">Email</p>
                        <p className="text-white">{profileData.contact.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Phone</p>
                        <p className="text-white">{profileData.contact.phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Instagram</p>
                        <p className="text-white">{profileData.contact.instagram}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Additional Notes */}
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Additional Notes</label>
                <textarea
                  value={profileData.additionalNotes}
                  onChange={(e) => setProfileData(prev => prev ? { ...prev, additionalNotes: e.target.value } : null)}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  rows={4}
                  placeholder="Share any additional preferences or requirements for your ideal roommate..."
                  disabled={!isEditing}
                />
              </div>

              {/* Move-in Date */}
              <div>
                <label htmlFor="moveInDate" className={commonLabelClasses}>Preferred Move-in Date</label>
                <input
                  type="date"
                  id="moveInDate"
                  name="moveInDate"
                  value={profileData.moveInDate}
                  onChange={handleChange}
                  className={commonInputClasses}
                  required
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Lifestyle */}
              <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700">
                <h2 className="text-xl font-semibold text-blue-400 mb-4">Lifestyle</h2>
                <div className="grid grid-cols-2 gap-4">
                  {isEditing ? (
                    <>
                      <div>
                        <label htmlFor="smoking" className={commonLabelClasses}>Smoking</label>
                        <select
                          id="smoking"
                          name="smoking"
                          value={profileData.smoking}
                          onChange={handleChange}
                          className={commonInputClasses}
                        >
                          <option value="no">No Smoking</option>
                          <option value="sometimes">Sometimes</option>
                          <option value="yes">Smoker</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="pets" className={commonLabelClasses}>Pets</label>
                        <select
                          id="pets"
                          name="pets"
                          value={profileData.pets}
                          onChange={handleChange}
                          className={commonInputClasses}
                        >
                          <option value="no">No Pets</option>
                          <option value="flexible">Flexible</option>
                          <option value="yes">Have Pets</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="cleanliness" className={commonLabelClasses}>Cleanliness</label>
                        <select
                          id="cleanliness"
                          name="cleanliness"
                          value={profileData.cleanliness}
                          onChange={handleChange}
                          className={commonInputClasses}
                        >
                          <option value="very clean">Very Clean</option>
                          <option value="moderate">Moderate</option>
                          <option value="relaxed">Relaxed</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="noiseLevel" className={commonLabelClasses}>Noise Level</label>
                        <select
                          id="noiseLevel"
                          name="noiseLevel"
                          value={profileData.noiseLevel}
                          onChange={handleChange}
                          className={commonInputClasses}
                        >
                          <option value="quiet">Quiet</option>
                          <option value="moderate">Moderate</option>
                          <option value="social">Social</option>
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </div>

              {/* Interests */}
              <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700">
                <h2 className="text-xl font-semibold text-blue-400 mb-4">Interests</h2>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {['Reading', 'Gaming', 'Cooking', 'Sports', 'Music', 'Travel', 'Art', 'Movies', 'Fitness', 'Photography'].map((interest) => (
                        <button
                          key={interest}
                          onClick={() => handleInterestsChange(interest)}
                          className={`px-4 py-2 rounded-full transition-colors ${
                            profileData.interests.includes(interest)
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
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
                )}
              </div>

              {/* Schedule */}
              <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700">
                <h2 className="text-xl font-semibold text-blue-400 mb-4">Schedule & Habits</h2>
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <div>
                        <label htmlFor="workSchedule" className={commonLabelClasses}>Work Schedule</label>
                        <select
                          id="workSchedule"
                          name="workSchedule"
                          value={profileData.workSchedule}
                          onChange={handleChange}
                          className={commonInputClasses}
                        >
                          <option value="9-5">9 AM - 5 PM</option>
                          <option value="night shift">Night Shift</option>
                          <option value="flexible">Flexible</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="guests" className={commonLabelClasses}>Guest Policy</label>
                        <select
                          id="guests"
                          name="guests"
                          value={profileData.guests}
                          onChange={handleChange}
                          className={commonInputClasses}
                        >
                          <option value="rarely">Rarely</option>
                          <option value="sometimes">Sometimes</option>
                          <option value="often">Often</option>
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-gray-400 text-sm">Work Schedule</p>
                        <p className="text-white">{profileData.workSchedule}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Guest Policy</p>
                        <p className="text-white capitalize">{profileData.guests}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Edit Mode Actions */}
          {isEditing && (
            <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 p-4">
              <div className="container mx-auto max-w-4xl flex justify-end space-x-4">
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 