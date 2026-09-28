require('dotenv').config();
const mongoose = require('mongoose');
require('../app_api/models/user');
const User = mongoose.model('users');

const { MONGODB_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
if (!MONGODB_URI || !ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12) {
  console.error('Set MONGODB_URI, ADMIN_NAME, ADMIN_EMAIL, and a unique ADMIN_PASSWORD of at least 12 characters in .env');
  process.exit(1);
}

(async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    if (await User.exists({ email: ADMIN_EMAIL })) {
      console.error('An account with that email already exists');
      process.exitCode = 1;
      return;
    }
    const user = new User({ name: ADMIN_NAME, email: ADMIN_EMAIL });
    user.setPassword(ADMIN_PASSWORD);
    await user.save();
    console.log('Administrator account created');
  } catch (error) {
    console.error('Unable to create administrator account:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
