import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface OnboardingFormProps {
  onComplete: () => void;
}

const OnboardingForm = ({ onComplete }: OnboardingFormProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    age: '',
    occupation: '',
    location: '',
    moveInDate: '',
    
    // Living Preferences
    budget: '',
    preferredLocation: '',
    roomType: 'private', // private, shared, or flexible
    leaseLength: '',
    
    // Lifestyle
    smoking: 'no', // yes, no, or sometimes
    pets: 'no', // yes, no, or flexible
    cleanliness: 'moderate', // very clean, moderate, or relaxed
    noiseLevel: 'moderate', // quiet, moderate, or social
    
    // Schedule
    workSchedule: '9-5', // 9-5, night shift, or flexible
    guests: 'sometimes', // rarely, sometimes, or often
    
    // Additional Info
    bio: '',
    interests: [] as string[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Store profile data in localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      localStorage.setItem('userData', JSON.stringify({
        ...userData,
        profile: {
          ...formData,
          // Add any additional profile fields here
          fullName: `${userData.firstName} ${userData.lastName}`,
          createdAt: new Date().toISOString()
        }
      }));
      
      console.log('Profile data:', formData);
      onComplete();
      navigate('/profile');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-blue-400">Basic Information</h3>
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-2">
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="occupation" className="block text-sm font-medium text-gray-300 mb-2">
                Occupation
              </label>
              <input
                type="text"
                id="occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                Current Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="moveInDate" className="block text-sm font-medium text-gray-300 mb-2">
                Preferred Move-in Date
              </label>
              <input
                type="date"
                id="moveInDate"
                name="moveInDate"
                value={formData.moveInDate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-blue-400">Living Preferences</h3>
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-2">
                Monthly Budget
              </label>
              <input
                type="text"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="e.g., $1000-1500"
                required
              />
            </div>
            <div>
              <label htmlFor="preferredLocation" className="block text-sm font-medium text-gray-300 mb-2">
                Preferred Location
              </label>
              <input
                type="text"
                id="preferredLocation"
                name="preferredLocation"
                value={formData.preferredLocation}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="roomType" className="block text-sm font-medium text-gray-300 mb-2">
                Room Type
              </label>
              <select
                id="roomType"
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="private">Private Room</option>
                <option value="shared">Shared Room</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
            <div>
              <label htmlFor="leaseLength" className="block text-sm font-medium text-gray-300 mb-2">
                Preferred Lease Length
              </label>
              <select
                id="leaseLength"
                name="leaseLength"
                value={formData.leaseLength}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="3-months">3 Months</option>
                <option value="6-months">6 Months</option>
                <option value="12-months">12 Months</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-blue-400">Lifestyle</h3>
            <div>
              <label htmlFor="smoking" className="block text-sm font-medium text-gray-300 mb-2">
                Smoking
              </label>
              <select
                id="smoking"
                name="smoking"
                value={formData.smoking}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="no">No Smoking</option>
                <option value="sometimes">Sometimes</option>
                <option value="yes">Smoker</option>
              </select>
            </div>
            <div>
              <label htmlFor="pets" className="block text-sm font-medium text-gray-300 mb-2">
                Pets
              </label>
              <select
                id="pets"
                name="pets"
                value={formData.pets}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="no">No Pets</option>
                <option value="flexible">Flexible</option>
                <option value="yes">Have Pets</option>
              </select>
            </div>
            <div>
              <label htmlFor="cleanliness" className="block text-sm font-medium text-gray-300 mb-2">
                Cleanliness Preference
              </label>
              <select
                id="cleanliness"
                name="cleanliness"
                value={formData.cleanliness}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="very-clean">Very Clean</option>
                <option value="moderate">Moderate</option>
                <option value="relaxed">Relaxed</option>
              </select>
            </div>
            <div>
              <label htmlFor="noiseLevel" className="block text-sm font-medium text-gray-300 mb-2">
                Noise Level Preference
              </label>
              <select
                id="noiseLevel"
                name="noiseLevel"
                value={formData.noiseLevel}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="quiet">Quiet</option>
                <option value="moderate">Moderate</option>
                <option value="social">Social</option>
              </select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-blue-400">Schedule & Habits</h3>
            <div>
              <label htmlFor="workSchedule" className="block text-sm font-medium text-gray-300 mb-2">
                Work Schedule
              </label>
              <select
                id="workSchedule"
                name="workSchedule"
                value={formData.workSchedule}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="9-5">9 AM - 5 PM</option>
                <option value="night-shift">Night Shift</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
            <div>
              <label htmlFor="guests" className="block text-sm font-medium text-gray-300 mb-2">
                Guest Policy
              </label>
              <select
                id="guests"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="rarely">Rarely</option>
                <option value="sometimes">Sometimes</option>
                <option value="often">Often</option>
              </select>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-blue-400">About You</h3>
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                rows={4}
                placeholder="Tell us about yourself..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Interests
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Reading', 'Gaming', 'Sports', 'Music', 'Cooking', 'Travel', 'Art', 'Fitness', 'Movies', 'Photography'].map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      formData.interests.includes(interest)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-2xl relative">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">Step {step} of 5</span>
            <span className="text-sm text-blue-400">{Math.round((step / 5) * 100)}% Complete</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full">
            <div
              className="h-2 bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStep()}

          <div className="flex justify-between pt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 text-gray-300 hover:text-white transition-colors"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              className="ml-auto px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              {step === 5 ? 'Complete Profile' : 'Next'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardingForm; 