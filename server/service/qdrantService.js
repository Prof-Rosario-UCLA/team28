const { qdrant } = require('../config/database');
require('dotenv').config({ path: '../.env' });

const encodeVector = (profile) => {
  return [
    parseInt(profile.age) / 100, // normalize
    parseInt(profile.budget) / 10000,
    profile.smoking === 'yes' ? 1 : 0,
    profile.pets === 'yes' ? 1 : 0,
    profile.cleanliness === 'high' ? 2 : profile.cleanliness === 'medium' ? 1 : 0,
    profile.noiseLevel === 'loud' ? 2 : profile.noiseLevel === 'moderate' ? 1 : 0,
    profile.guests === 'often' ? 2 : profile.guests === 'sometimes' ? 1 : 0,
    profile.leaseLength === 'long' ? 2 : profile.leaseLength === 'medium' ? 1 : 0,
    profile.roomType === 'private' ? 1 : 0,
    profile.sleepSchedule === 'night_owl' ? 1 : 0
  ];
}

async function upsertProfileVector(id, vector, payload = {}) {
  return qdrant.upsert(process.env.QDRANT_COLLECTION_NAME, {
    points: [{ id, vector, payload }]
  });
}

/*
async function getUserVector(id) {
  const [point] = await qdrant.retrieve(process.env.QDRANT_COLLECTION_NAME, {
    ids: [id],
    with_vector: true
  });
  return point?.vector || null;
}

async function searchSimilar(vector, limit = 5, excludeId = null) {
  return qdrant.search(process.env.QDRANT_COLLECTION_NAME, {
    vector,
    limit,
    filter: excludeId ? { must_not: [{ key: 'id', match: { value: excludeId } }] } : undefined
  });
}*/

module.exports = { upsertProfileVector, encodeVector /*, getUserVector, searchSimilar*/ };
