require('dotenv').config({ path: '.env' });
const { qdrant } = require('../config/database');

async function createRoommateCollection() {
  const collectionName = process.env.QDRANT_COLLECTION_NAME || 'roommate_collection';
  const vectorSize = 10; 
  
  try {
    // Check if collection already exists
    const collections = await qdrant.getCollections();
    const exists = collections.collections.some(collection => collection.name === collectionName);
    
    if (exists) {
      console.log(`Collection '${collectionName}' already exists.`);
      return;
    }
    
    // Create the collection with vector configuration
    await qdrant.createCollection(collectionName, {
      vectors: {
        size: vectorSize,
        distance: 'Cosine' //play aroudn with this? euclidean, cosine, dot
      },
    });
    
    console.log(`Successfully created '${collectionName}' collection in Qdrant`);
  } catch (error) {
    console.error('Error creating Qdrant collection:', error);
  }
}

// Runs scripts
createRoommateCollection()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Unhandled error:', err);
    process.exit(1);
  });