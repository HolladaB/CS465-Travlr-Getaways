require('dotenv').config();
const mongoose = require('mongoose');
const Trip = require('./travlr');
const trips = require('../../data/trips.json');
const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/travlr';

(async () => {
  try {
    await mongoose.connect(uri);
    if (await Trip.countDocuments() > 0) {
      throw new Error('Trips already exist; refusing to replace existing data');
    }
    await Trip.insertMany(trips);
    console.log(`Added ${trips.length} sample trips`);
  } catch (error) {
    console.error('Unable to seed trips:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
