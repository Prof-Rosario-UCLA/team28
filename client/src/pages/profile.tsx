import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import OfflineCard from '../components/OfflineCard';


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
  const [isOffline, setIsOffline] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editedProfile, setEditedProfile] = useState<ProfileData | null>(null);
  const [genBioClicked, setGenBioClicked] = useState(false);

// AI Generate Bio Function
const handleGenBioClicked = async () => {
  setGenBioClicked(true);
  try {
    const prompt = `Write a short, friendly roommate bio with the following info:\n
      Full Name: ${profileData?.fullName}\n
      Age: ${profileData?.age}\n
      Occupation: ${profileData?.occupation}\n
      Location: ${profileData?.location}\n
      Interests: ${profileData?.interests.join(', ')}\n
      Smoking: ${profileData?.smoking}\n
      Pets: ${profileData?.pets}\n
      Cleanliness: ${profileData?.cleanliness}\n
      Noise Level: ${profileData?.noiseLevel}\n
      Work Schedule: ${profileData?.workSchedule}\n
      Guests: ${profileData?.guests}\n
      Additional Notes: ${profileData?.additionalNotes}\n`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API error: ${response.status} - ${errorText}`);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const output =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'No bio could be generated.';
    setProfileData(prev => prev ? { ...prev, bio: output } : null);
  } catch (error) {
    console.error('Error generating bio:', error);
  }
};


  // Fetch profile data from MongoDB
  useEffect(() => {
    if (!navigator.onLine) {
      setIsOffline(true);
      return;
    }

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }

        const response = await fetch('/api/profile/me', {
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

      const response = await fetch('/api/profile/update', {
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
      setProfileData(prev =>
        prev
          ? {
              ...prev,
              ...data.profile,
              fullName: prev.fullName,
              createdAt: prev.createdAt
            }
          : data.profile
      );
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    }
  };

  if (!profileData) {
    return (
      <div>
        <Navbar isAuthenticated={true}/>
        <OfflineCard />
      </div>
    )
  }

  const commonInputClasses = "w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
  const commonLabelClasses = "block text-sm font-medium text-gray-300 mb-2";

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 text-white">
    <Navbar isAuthenticated={true} />
    
    { isOffline ? (
      <OfflineCard />
      ) : (
        isLoading ? (
          <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Loading Profile...</h2>
            <p className="text-gray-400">Please wait while we load your profile data.</p>
          </div>
        </div>
        ) : (
          <div>
            {/* Fixed Header */}
            <div className="flex-shrink-0  pt-0 pb-2 sm:pt-6 sm:pb-4">
              <div className="container mx-auto">
                <div className="flex justify-between items-center px-4">
                  <h1 className="text-lg sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    My Profile
                  </h1>
                  {isEditing ? (
                    <div className="flex items-center gap-2 sm:gap-4">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-2 py-1 bg-blue-500 text-white px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-base bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="inline">Cancel</span>
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-2 py-1 bg-blue-500 text-white px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-base text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="hidden sm:inline">Save Changes</span>
                        <span className="sm:hidden">Save</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-2 py-1 bg-blue-500  text-white px-2 py-1 sm:px-4 sm:py-2  text-xs sm:text-base text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <span className="hidden sm:inline">Edit Profile</span>
                      <span className="sm:hidden">Edit</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className={`flex-1 overflow-auto `}>
              <div className="container mx-auto px-4 py-8">
                <div className="max-w-5xl mx-auto"></div>
                  {/* Main Profile Container */}
                  <div className="bg-gray-800/50 rounded-3xl p-4 sm:p-8 backdrop-blur-sm border border-gray-700 shadow-xl">
                    {/* Profile Header */}
                    <div className="flex items-center space-x-4 sm:space-x-6 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-700">
                      <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-lg sm:text-3xl font-bold shadow-lg">
                        {profileData.fullName?.[0]}{profileData.fullName?.[1]}
                      </div>
                      <div className="flex-grow">
                        <div className="space-y-2 sm:space-y-4">
                          <div>
                            <h1 className="text-lg sm:text-3xl font-bold mb-1 sm:mb-2">{profileData.fullName}</h1>
                            <p className="text-gray-400 text-sm sm:text-base">{profileData.occupation}</p>
                            <p className="text-gray-400 text-sm sm:text-base">{profileData.location}</p>
                            <p className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2">
                              Member since {new Date(profileData.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                      {/* Left Column */}
                      <div className="space-y-6 sm:space-y-8">
                        {/* About Me */}
                        <div className="bg-gray-700/30 rounded-2xl p-4 sm:p-6 border border-gray-600">
                          <h2 className="text-lg sm:text-xl font-semibold text-blue-400 mb-3 sm:mb-4 flex items-center gap-2">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            About Me
                          </h2>
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
                              <button
                                onClick={handleGenBioClicked}
                                className={`px-3 py-2 sm:px-4 sm:py-2 rounded-full transition-colors text-sm sm:text-base ${
                                  genBioClicked
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                              >
                                AI Generate Bio
                              </button>
                            </div>
                          ) : (
                            <p className="text-gray-300 text-sm sm:text-base">{profileData.bio}</p>
                          )}
                        </div>

                        {/* Living Preferences */}
                        <div className="bg-gray-700/30 rounded-2xl p-4 sm:p-6 border border-gray-600">
                          <h2 className="text-lg sm:text-xl font-semibold text-blue-400 mb-3 sm:mb-4 flex items-center gap-2">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Living Preferences
                          </h2>
                          <div className="space-y-3 sm:space-y-4">
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
                                  <p className="text-gray-400 text-xs sm:text-sm">Budget</p>
                                  <p className="text-white text-sm sm:text-base">{profileData.budget}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400 text-xs sm:text-sm">Preferred Location</p>
                                  <p className="text-white text-sm sm:text-base">{profileData.preferredLocation}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400 text-xs sm:text-sm">Room Type</p>
                                  <p className="text-white text-sm sm:text-base capitalize">{profileData.roomType}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400 text-xs sm:text-sm">Lease Length</p>
                                  <p className="text-white text-sm sm:text-base">{profileData.leaseLength}</p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-gray-700/30 rounded-2xl p-4 sm:p-6 border border-gray-600">
                          <h2 className="text-lg sm:text-xl font-semibold text-blue-400 mb-3 sm:mb-4 flex items-center gap-2">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Contact Information
                          </h2>
                          <div className="space-y-3 sm:space-y-4">
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
                                  <p className="text-gray-400 text-xs sm:text-sm">Email</p>
                                  <p className="text-white text-sm sm:text-base">{profileData.contact.email}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400 text-xs sm:text-sm">Phone</p>
                                  <p className="text-white text-sm sm:text-base">{profileData.contact.phone}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400 text-xs sm:text-sm">Instagram</p>
                                  <p className="text-white text-sm sm:text-base">{profileData.contact.instagram}</p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Additional Notes */}
                        <div className="mb-4 sm:mb-6">
                          <label className="block text-gray-300 mb-2 text-sm sm:text-base">Additional Notes</label>
                          <textarea
                            value={profileData.additionalNotes}
                            onChange={(e) => setProfileData(prev => prev ? { ...prev, additionalNotes: e.target.value } : null)}
                            className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white text-sm sm:text-base"
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
                      <div className="space-y-6 sm:space-y-8">
                        {/* Lifestyle */}
                        <div className="bg-gray-700/30 rounded-2xl p-4 sm:p-6 border border-gray-600">
                          <h2 className="text-lg sm:text-xl font-semibold text-blue-400 mb-3 sm:mb-4 flex items-center gap-2">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Lifestyle
                          </h2>
                          <div className="grid grid-cols-2 gap-3 sm:gap-4">
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
                                  <p className="text-gray-400 text-xs sm:text-sm">Smoking</p>
                                  <p className="text-white text-sm sm:text-base capitalize">{profileData.smoking}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400 text-xs sm:text-sm">Pets</p>
                                  <p className="text-white text-sm sm:text-base capitalize">{profileData.pets}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400 text-xs sm:text-sm">Cleanliness</p>
                                  <p className="text-white text-sm sm:text-base capitalize">{profileData.cleanliness}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400 text-xs sm:text-sm">Noise Level</p>
                                  <p className="text-white text-sm sm:text-base capitalize">{profileData.noiseLevel}</p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Interests */}
                        <div className="bg-gray-700/30 rounded-2xl p-4 sm:p-6 border border-gray-600">
                          <h2 className="text-lg sm:text-xl font-semibold text-blue-400 mb-3 sm:mb-4 flex items-center gap-2">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            Interests
                          </h2>
                          {isEditing ? (
                            <div className="space-y-3 sm:space-y-4">
                              <div className="flex flex-wrap gap-2">
                                {['Reading', 'Gaming', 'Cooking', 'Sports', 'Music', 'Travel', 'Art', 'Movies', 'Fitness', 'Photography'].map((interest) => (
                                  <button
                                    key={interest}
                                    onClick={() => handleInterestsChange(interest)}
                                    className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full transition-colors text-sm sm:text-base ${
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
                                  className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm sm:text-base"
                                >
                                  {interest}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Schedule */}
                        <div className="bg-gray-700/30 rounded-2xl p-4 sm:p-6 border border-gray-600">
                          <h2 className="text-lg sm:text-xl font-semibold text-blue-400 mb-3 sm:mb-4 flex items-center gap-2">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Schedule & Habits
                          </h2>
                          <div className="space-y-3 sm:space-y-4">
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
                                  <p className="text-gray-400 text-xs sm:text-sm">Work Schedule</p>
                                  <p className="text-white text-sm sm:text-base">{profileData.workSchedule}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400 text-xs sm:text-sm">Guest Policy</p>
                                  <p className="text-white text-sm sm:text-base capitalize">{profileData.guests}</p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
          )
        )
      }
    </div>
  );
};

export default Profile; 