type NoMatchesProps = {
    isMatch: boolean;
};

const NoMatches = ({ isMatch }: NoMatchesProps) => {
  const headerText = isMatch ? 'No Matches Yet' : 'No Likes Yet';
  const descriptionText = isMatch 
    ? "You don't have any match currently. Keep swiping to find your perfect roommate!" 
    : "You don't have any like currently. Keep swiping to find your perfect roommate!";

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-24 h-24 mb-6 rounded-full bg-gray-700 flex items-center justify-center">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-300 mb-2">{headerText}</h3>
      <p className="text-gray-400 max-w-md">
        {descriptionText}
      </p>
    </div>
  );
};

export default NoMatches;
