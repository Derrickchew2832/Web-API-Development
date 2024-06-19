const Details = require('../Server/models/Details');

const saveDetails = async (req, res) => {
  const { destination, attraction, flight, weather } = req.body;

  try {
    const newDetails = new Details({
      destination,
      attraction,
      flight,
      weather
    });

    await newDetails.save();

    res.status(201).json({ message: 'Details saved successfully' });
  } catch (error) {
    console.error('Error saving details:', error);
    res.status(500).json({ error: 'Error saving details' });
  }
};

module.exports = {
  saveDetails,
};
