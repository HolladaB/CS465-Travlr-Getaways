const express = require('express'); // Express app
const router = express.Router(); // Router logic
const { expressjwt: jwt } = require('express-jwt');
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be set to a random value of at least 32 characters');
}
const auth = jwt({
    secret: process.env.JWT_SECRET, 
    algorithms: ['HS256'], 
    requestProperty: 'payLoad'
});

// This is where we import the controllers we will route
const authController = require('../controllers/authentication');
const tripsController = require('../controllers/trips');

router
    .route('/login')
    .post(authController.login);

// Account creation is a local bootstrap operation. A public registration
// endpoint would grant every visitor administrator privileges.

// define route for our trips endpoint
router
    .route('/trips')
    .get(tripsController.tripsList) // GET Method routes tripList
    .post(auth, tripsController.tripsAddTrip); // POST Method Adds a Trip

// GET Method routes tripsFindByCode - require parameter
// PUT Method routes tripsUpdateTrip - requrie parameter
router
    .route('/trips/:tripCode')   
    .get(tripsController.tripsFindByCode)
    .put(auth, tripsController.tripsUpdateTrip)
    .delete(auth, tripsController.tripsDeleteTrip);

module.exports = router;    
 
