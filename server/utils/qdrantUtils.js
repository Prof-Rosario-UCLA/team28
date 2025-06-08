const { qdrant } = require('../config/database');
require('dotenv').config({ path: '../.env' });

// converts a user's profile data (from users mongo table) into a profile vector
const encodeVector = (profile) => {
  return [
    parseInt(profile.age) / 100, // normalize age
    parseInt(profile.budget) / 10000, // normalize budget
    
    // Living Preferences
    profile.roomType === 'private' ? 2 : profile.roomType === 'shared' ? 1 : 0.5, // private=2, shared=1, flexible=0.5
    profile.leaseLength === 'long' ? 2 : profile.leaseLength === 'medium' ? 1 : 0.5,
    
    // Lifestyle
    profile.smoking === 'yes' ? 2 : profile.smoking === 'sometimes' ? 1 : 0, // yes=2, sometimes=1, no=0
    profile.pets === 'yes' ? 2 : profile.pets === 'flexible' ? 1 : 0, // yes=2, flexible=1, no=0
    profile.cleanliness === 'very clean' ? 2 : profile.cleanliness === 'moderate' ? 1 : 0, // very clean=2, moderate=1, relaxed=0
    profile.noiseLevel === 'social' ? 2 : profile.noiseLevel === 'moderate' ? 1 : 0, // social=2, moderate=1, quiet=0
    
    // Schedule
    profile.workSchedule === '9-5' ? 2 : profile.workSchedule === 'night shift' ? 1 : 0.5, // 9-5=2, night shift=1, flexible=0.5
    profile.guests === 'often' ? 2 : profile.guests === 'sometimes' ? 1 : 0, // often=2, sometimes=1, rarely=0
  ];
}

// stores and updates a user's profile vector into qdrant
async function upsertProfileVector(id, vector, payload = {}) {
  try {
    await qdrant.upsert(process.env.QDRANT_COLLECTION_NAME, {
      points: [{ id, vector, payload }]
    });
    console.log(`Successfully upserted vector for ID ${id}`);
  } catch (error) {
    console.error('Error upserting vector:', error);
    throw error;
  }
}

// retrieves a user's vector from qdrant
async function getUserVector(id) {
  try {
    const [point] = await qdrant.retrieve(process.env.QDRANT_COLLECTION_NAME, {
      ids: [id],
      with_vector: true
    });
    return point?.vector || null;
  } catch (error) {
    console.error('Error retrieving user vector:', error);
    return null;
  }
}

// given a user, searches for similar profiles in qdrant
async function searchSimilarUsers(userId, limit = 20) {
  try {
    const userVector = await getUserVector(userId);
    if (!userVector) {
      throw new Error('User vector not found in Qdrant');
    }

    const similarUsers = await qdrant.search(process.env.QDRANT_COLLECTION_NAME, {
      vector: userVector,
      limit,
      filter: {
        must_not: [
          { key: 'id', match: { value: userId } }  // Exclude self
        ]
      }
    });

    return similarUsers;
  } catch (error) {
    console.error('Error searching similar users:', error);
    throw error;
  }
}

module.exports = { upsertProfileVector, encodeVector, getUserVector, searchSimilarUsers };
