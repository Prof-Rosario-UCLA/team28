require('dotenv').config();
const { qdrant } = require('../config/database');

// creates a collection in qdrant
async function createRoommateCollection() {
  const collectionName = process.env.QDRANT_COLLECTION_NAME || 'roommate_profiles';
  const vectorSize = 10; 
  
  try {
    // Check if collection already exists
    const collections = await qdrant.getCollections();
    const exists = collections.collections.some(collection => collection.name === collectionName);
    
    if (exists) {
      console.log(`Collection '${collectionName}' already exists.`);
      // Create index if it doesn't exist
      try {
        await qdrant.createPayloadIndex(collectionName, {
          field_name: 'id',
          field_schema: 'integer'
        });
        console.log('Created index for id field');
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log('Index for id field already exists');
        } else {
          throw error;
        }
      }
      return;
    }
    
    // Create the collection with vector configuration
    await qdrant.createCollection(collectionName, {
      vectors: {
        size: vectorSize,
        distance: 'Cosine' //play aroudn with this? euclidean, cosine, dot
      },
    });
    
    // Create index for id field
    await qdrant.createPayloadIndex(collectionName, {
      field_name: 'id',
      field_schema: 'integer'
    });
    
    console.log(`Successfully created '${collectionName}' collection in Qdrant with id index`);
  } catch (error) {
    console.error('Error creating Qdrant collection:', error);
    throw error;
  }
}

// Runs scripts
createRoommateCollection()
  .then(() => {
    console.log('Collection creation completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Failed to create collection:', error);
    process.exit(1);
  });