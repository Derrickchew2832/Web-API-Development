//src//api//index.js
const axios = require('axios');

const getPlacesData = async (type, sw, ne) => {
  try {
    const response = await axios.get(`https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`, {
      params: {
        bl_latitude: sw.lat,
        bl_longitude: sw.lng,
        tr_longitude: ne.lng,
        tr_latitude: ne.lat,
      },
      headers: {
        'x-rapidapi-key': 'ab748d25a0msh32de561f0f5bd3cp1cf1f7jsnb25e6db14c28',
        'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch places data');
  }
};

module.exports = { getPlacesData };




