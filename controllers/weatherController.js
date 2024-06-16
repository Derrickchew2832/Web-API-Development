const axios = require('axios');

const getWeather = async (req, res) => {
  const { cityName } = req.body;

  try {
    // Use Google Maps Geocoding API to convert city name to latitude and longitude
    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
    const geocodingResponse = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: cityName,
        key: googleMapsApiKey
      }
    });

    if (geocodingResponse.data.status !== 'OK') {
      return res.status(404).json({ error: 'City not found' });
    }

    const location = geocodingResponse.data.results[0].geometry.location;
    const { lat, lng } = location;

    // Use Open-Meteo API to fetch weather data using latitude and longitude
    const weatherResponse = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
      params: {
        latitude: lat,
        longitude: lng,
        current_weather: true,
        daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum',
        timezone: 'Europe/Berlin'
      }
    });

    const weatherData = weatherResponse.data;

    res.json({
      description: weatherData.current_weather.weathercode,
      temperature: weatherData.current_weather.temperature
    });
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    res.status(500).json({ error: `Error fetching weather data: ${error.message}` });
  }
};

module.exports = {
  getWeather,
};
