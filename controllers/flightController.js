const axios = require('axios');

const getAccessToken = async () => {
  const tokenUrl = 'https://test.api.amadeus.com/v1/security/oauth2/token';
  const client_id = 'Jn2jTVNRGRQacb0GVV6TAnTBAbgyWZmY';
  const client_secret = 'bdfMfVCgxsS0LFKS';

  try {
    const response = await axios.post(tokenUrl, new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: client_id,
      client_secret: client_secret
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error.response ? error.response.data : error.message);
    throw new Error('Could not obtain access token');
  }
};

const searchFlights = async (req, res) => {
  const { departure, destination, departureDate, returnDate, numPeople, classType, tripType, children, infants, nonStop, currencyCode, maxPrice } = req.body;

  try {
    const accessToken = await getAccessToken();

    const flightParams = {
      originLocationCode: departure,
      destinationLocationCode: destination,
      departureDate: departureDate,
      returnDate: tripType === 'round-trip' ? returnDate : undefined,
      adults: numPeople,
      children: children || 0,
      infants: infants || 0,
      travelClass: classType,
      nonStop: nonStop || false,
      currencyCode: currencyCode || 'USD',
      maxPrice: maxPrice || 10000,
      max: 250
    };

    const flightResponse = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
      params: flightParams,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const flightData = flightResponse.data;

    res.json(flightData);
  } catch (error) {
    console.error('Error fetching flight data:', error.message);
    res.status(500).json({ error: `Error fetching flight data: ${error.message}` });
  }
};

module.exports = {
  searchFlights,
};
