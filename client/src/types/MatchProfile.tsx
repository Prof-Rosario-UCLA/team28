export interface MatchProfile {
  _id: string; // or use id: number if that's what you're using from your data source
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
	cleanliness: string;
	roomType: string;
	leaseLength: string;
  interests: string[];
  smoking: string;
  pets: string;
	guests: string;
	workSchedule: string;

  contact: {
    email: string;
    phone: string;
    instagram: string;
  };
  additionalNotes;
}