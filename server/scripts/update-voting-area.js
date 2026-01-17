// Script to update existing users with votingArea from preregistered data
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const PreregisteredCitizen = require('../models/PreregisteredCitizen');

async function updateVotingAreas() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all users without votingArea
    const users = await User.find({ 
      $or: [
        { votingArea: { $exists: false } },
        { votingArea: null },
        { votingArea: '' }
      ]
    });

    console.log(`Found ${users.length} users without votingArea`);

    let updated = 0;
    for (const user of users) {
      // Find preregistered citizen by NID
      const preregistered = await PreregisteredCitizen.findOne({ nid: user.nid });
      
      if (preregistered && preregistered.votingArea) {
        user.votingArea = preregistered.votingArea;
        await user.save();
        console.log(`✅ Updated ${user.name} (${user.nid}) with votingArea: ${preregistered.votingArea}`);
        updated++;
      } else {
        console.log(`⚠️ No preregistered data found for ${user.name} (${user.nid})`);
      }
    }

    console.log(`\n✅ Updated ${updated} users`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateVotingAreas();
