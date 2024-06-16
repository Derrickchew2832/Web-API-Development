const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { searchAttractionsAndMap } = require('../controllers/attractionController');
const { searchFlights } = require('../controllers/flightController');
const { getWeather } = require('../controllers/weatherController');
const { saveDetails } = require('../controllers/saveController');
const auth = require('../Middleware/auth');
const router = express.Router();

// Register user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Protect these routes with auth middleware
router.post('/attractions/map', auth, searchAttractionsAndMap);
router.post('/flights/search', auth, searchFlights);
router.post('/weather/get', auth, getWeather);
router.post('/save', auth, saveDetails);

module.exports = router;
