const User = require('../models/User'); 
const { upsertProfileVector, encodeVector } = require('../utils/qdrantUtils');

const insertProfile = async (req, res) => {
    try {
        console.log('Received profile data:', req.body);
        const { userId, profileData } = req.body;
        /* INSERT LOGIC HERE FOR MONGO DB */
        //Insert profile into Qdrant
        const userVector = encodeVector(profileData);
        const newProfile = await upsertProfileVector(userId, userVector);
        if (!newProfile) {
            return res.status(400).json({ message: 'Failed to create profile' });
        }

        res.status(201).json({ message: 'Profile created successfully', profile: newProfile });
    } catch (error) {
        console.error('Error inserting profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { insertProfile };