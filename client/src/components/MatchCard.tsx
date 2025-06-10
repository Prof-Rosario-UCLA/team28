import React from 'react';
// Use a relative URL to the public directory for the default profile image
const defaultProfile = '/defaultProfile.jpg';

interface MatchCardProps {
  match: {
    _id: number;
    name: string;
    age: number;
    occupation: string;
    location: string;
    matchScore: number;
    image: string;
    bio: string;
    lifestyle: string;
    schedule: string;
    noiseLevel: string;
    interests: string[];
    contact: {
      email: string;
      phone: string;
      instagram: string;
    };
  };
  onViewProfile: (match: MatchCardProps['match']) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onViewProfile }) => {
  return (
    <div
      className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700 hover:border-blue-500/50 transition-all cursor-pointer"
      onClick={() => onViewProfile(match)}
    >
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={match.image || defaultProfile}
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
  );
};

export default MatchCard;