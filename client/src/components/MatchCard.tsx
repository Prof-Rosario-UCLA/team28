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
        className="bg-gray-800/50 rounded-2xl p-4 sm:p-6 backdrop-blur-sm border border-gray-700 hover:border-blue-500/50 transition-all cursor-pointer"
        onClick={() => onViewProfile(match)}
    >
        <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
        <img
            src={match.image || defaultProfile}
            alt={match.name}
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-semibold truncate">{match.name}</h3>
            <p className="text-gray-400 text-sm sm:text-base truncate">{match.occupation}</p>
        </div>
        <div className="flex-shrink-0">
            <span className="px-2 py-1 sm:px-3 bg-blue-500/20 text-blue-400 rounded-full text-xs sm:text-sm">
            {(match.matchScore * 100).toFixed(1)}%
            </span>
        </div>
        </div>
        <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-2">{match.bio}</p>
        <div className="flex flex-wrap gap-1 sm:gap-2">
        {match.interests.slice(0, 4).map((interest) => (
            <span
            key={interest}
            className="px-2 py-1 sm:px-3 bg-gray-700 text-gray-300 rounded-full text-xs sm:text-sm"
            >
            {interest}
            </span>
        ))}
        {match.interests.length > 4 && (
            <span className="px-2 py-1 sm:px-3 bg-gray-600 text-gray-400 rounded-full text-xs sm:text-sm">
            +{match.interests.length - 4}
            </span>
        )}
        </div>
    </div>
    );
};

export default MatchCard;