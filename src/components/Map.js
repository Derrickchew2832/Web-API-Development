//src//components//Map.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const { getPlacesData } = require('../api/index');

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

const getMapData = async (coords) => {
  try {
    const { data } = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        location: `${coords.lat},${coords.lng}`,
        radius: 1500,
        key: GOOGLE_MAPS_API_KEY,
      }
    });
    return data.results;
  } catch (error) {
    console.error('Failed to fetch map data:', error);
    throw new Error('Failed to fetch map data');
  }
};

router.get('/', async (req, res) => {
  const { lat, lng, type = 'restaurants' } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ message: 'Latitude and Longitude are required' });
  }

  try {
    const coords = { lat: Number(lat), lng: Number(lng) };
    const bounds = { ne: { lat: coords.lat + 0.1, lng: coords.lng + 0.1 }, sw: { lat: coords.lat - 0.1, lng: coords.lng - 0.1 } };

    const mapData = await getMapData(coords);
    const placesData = await getPlacesData(type, bounds.sw, bounds.ne);

    res.json({ mapData, placesData });
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;