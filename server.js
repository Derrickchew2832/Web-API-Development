
const mongoose = require('mongoose');
const path = require('path');
const express = require('express');
const hbs = require('hbs');
const dotenv = require('dotenv');
const fs = require('fs');
const axios = require('axios');
const iataToCountry = require('./src/api/iataToCountry');

const User = require('./src/api/mongodb'); // Import the User model

const app = express();
const PORT = process.env.PORT || 3000;


access_token = "SQfnWD654qJ3LkgeBNJc7DhQg01b";
WeatherAPI_KEY = '44b3e9adf3683242335d983c9f932425';


// Middleware setup
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// View engine setup
const templatePath = path.join(__dirname, 'src/templates');
app.set('view engine', 'hbs');
app.set('views', templatePath);
app.use(express.urlencoded({ extended: false }));

// Registering handlebars helper

hbs.registerHelper('getCountryNameFromIata', function (iataCode) {
  return iataToCountry[iataCode] || 'Unknown';
});

// Connect to MongoDB

// Routes
app.use('/api/map', require('./src/components/Map'));

// Login route
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const data = {
    email: req.body.email,
    password: req.body.password,
  };

  try {
    const check = await User.findOne({ email: data.email });

    if (!check) {
      return res.render('login', { error: 'User not found' });
    }

    if (check.password === data.password) {
      res.render('home');
    } else {
      res.render('login', { error: 'Incorrect password' });
    }
  } catch (error) {
    res.render('login', { error: 'An error occurred during login' });
  }
});

// Signup route
app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup', async (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  try {
    const check = await User.findOne({ email: data.email });

    if (check) {
      return res.render('signup', { error: 'User already exists' });
    } else {
      await User.create(data);
      res.render('home');
    }
  } catch (error) {
    res.render('signup', { error: error.message });
  }
});

// Home route
app.get('/home', async (req, res) => {
  try {
    const tokenResponse = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      'grant_type=client_credentials&client_id=wXcnvZ1kZuhDlPGMtmTS4oHotnsJyLZK&client_secret=JkxOBfPggJLtDwF7',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      }
    );

    const accessToken = tokenResponse.data.access_token;
    const weatherResponse = await axios.post(`https://api.openweathermap.org/data/2.5/weather?q=Penang&appid=${WeatherAPI_KEY}&units=metric`);
    const airplaneResponse = await axios.get(`https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=SYD&destinationLocationCode=BKK&departureDate=2024-07-25&returnDate=2024-07-29&adults=1&children=0&infants=0&travelClass=ECONOMY&nonStop=false&currencyCode=MYR&maxPrice=5000&max=10`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      }
    );

    res.render('home', {
      data: airplaneResponse.data.data,
      weatherdata: weatherResponse.data,
    });
  } catch (error) {
    console.error('Error making the request:', error);
    res.status(500).send('An error occurred');
  }
});

// Home POST route
app.post('/home', async (req, res) => {
  const data = {
    originLocationCode: req.body.originLocationCode,
    destinationLocationCode: req.body.destinationLocationCode,
    departureDate: req.body.departureDate,
    returnDate: req.body.returnDate,
    adults: req.body.adults,
    children: req.body.children,
    infants: req.body.infants,
    travelClass: req.body.travelClass,
    nonStop: req.body.nonStop,
    maxPrice: req.body.maxPrice,
  };

  try {
    const tokenResponse = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      'grant_type=client_credentials&client_id=wXcnvZ1kZuhDlPGMtmTS4oHotnsJyLZK&client_secret=JkxOBfPggJLtDwF7',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      }
    );

    const accessToken = tokenResponse.data.access_token;
    const countryName = iataToCountry[data.originLocationCode] || 'Unknown';
    const weatherResponse = await axios.post(`https://api.openweathermap.org/data/2.5/weather?q=${countryName}&appid=${WeatherAPI_KEY}&units=metric`);
    const airplaneResponse = await axios.get(
      `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${data.originLocationCode}&destinationLocationCode=${data.destinationLocationCode}&departureDate=${data.departureDate}&returnDate=${data.returnDate}&adults=${data.adults}&children=${data.children}&infants=${data.infants}&travelClass=${data.travelClass}&nonStop=${data.nonStop}&currencyCode=MYR&maxPrice=${data.maxPrice}&max=10`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      }
    );

    res.render('home', {
      data: airplaneResponse.data.data,
      weatherdata: weatherResponse.data,
    });
  } catch (error) {
    console.error('Error making the request:', error);
    res.status(500).send('An error occurred');
  }
});

// Fallback route for serving the index.html
app.get('/location', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'src', 'templates')));

app.use('/api/map', require('./src/components/Map'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { getPlacesData: () => {} }; // Define this function appropriately
