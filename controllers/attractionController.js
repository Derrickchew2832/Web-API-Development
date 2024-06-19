const axios = require('axios');

const searchAttractionsAndMap = async (req, res) => {
  const { destination } = req.body;
  console.log('Received destination:', destination);

  try {
    // Call Google Maps API to get latitude and longitude data for the destination
    console.log('Fetching map data from Google Maps API...');
    const mapResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${destination}&key=${process.env.GOOGLE_MAPS_API_KEY}`);
    console.log('Map API response status:', mapResponse.status);
    console.log('Map API response data:', JSON.stringify(mapResponse.data, null, 2));

    if (!mapResponse.data.results || mapResponse.data.results.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }

    const location = mapResponse.data.results[0].geometry.location;
    const latitude = location.lat;
    const longitude = location.lng;

    // Call TripAdvisor API via RapidAPI
    console.log('Fetching attractions data from TripAdvisor API via RapidAPI...');
    const options = {
      method: 'GET',
      url: 'https://travel-advisor.p.rapidapi.com/attractions/list-by-latlng',
      params: {
        longitude: longitude.toString(),
        latitude: latitude.toString(),
        lunit: 'km',
        currency: 'USD',
        lang: 'en_US'
      },
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'travel-advisor.p.rapidapi.com'
      }
    };

    const attractionResponse = await axios.request(options);
    console.log('Attractions API response status:', attractionResponse.status);
    console.log('Attractions API response data:', JSON.stringify(attractionResponse.data, null, 2));

    // Combine data from both APIs
    const combinedData = {
      attractions: attractionResponse.data.data,
      map: mapResponse.data,
    };

    res.json(combinedData);
  } catch (error) {
    console.error('Error fetching attractions or map data:', error.message);
    if (error.response && error.response.data) {
      console.error('Error response data:', JSON.stringify(error.response.data, null, 2));
      res.status(500).json({ error: error.response.data });
    } else {
      res.status(500).json({ error: `Error fetching attractions or map data: ${error.message}` });
    }
  }
};

module.exports = {
  searchAttractionsAndMap,
};
