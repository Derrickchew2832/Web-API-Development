const Details = require('../Server/models/details');

const saveDetails = async (req, res) => {
  const { destination, attraction, flight, weather } = req.body;
  const userId = req.user ? req.user.id : null;

  console.log('Request body:', req.body);  // Log the request body
  console.log('User ID:', userId);  // Log the user ID

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const newDetails = new Details({
      userId,
      destination,
      attraction,
      flight,
      weather
    });

    await newDetails.save();

    res.status(201).json({ message: 'Details saved successfully' });
  } catch (error) {
    console.error('Error saving details:', error.message);  // Log the error message
    res.status(500).json({ error: 'Error saving details', details: error.message });
  }
};

const getUserDetails = async (req, res) => {
  const userId = req.user ? req.user.id : null;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const userDetails = await Details.find({ userId });
    console.log('Fetched user details:', userDetails);  // Log the fetched user details
    res.status(200).json(userDetails);
  } catch (error) {
    console.error('Error fetching user details:', error.message);  // Log the error message
    res.status(500).json({ error: 'Error fetching user details', details: error.message });
  }
};

const deleteDetails = async (req, res) => {
  const detailId = req.params.id;

  try {
    const result = await Details.findByIdAndDelete(detailId);

    if (!result) {
      return res.status(404).json({ error: 'Detail not found' });
    }

    res.status(200).json({ message: 'Detail deleted successfully' });
  } catch (error) {
    console.error('Error deleting detail:', error.message);  // Log the error message
    res.status(500).json({ error: 'Error deleting detail', details: error.message });
  }
};

module.exports = {
  saveDetails,
  getUserDetails,
  deleteDetails,
};
