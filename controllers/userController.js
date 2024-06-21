const User = require('../Server/models/user'); // Assuming you have a User model
const Details = require('../Server/models/details');
const bcrypt = require('bcryptjs');

// Get user details
const getUserDetails = async (req, res) => {
  const userId = req.params.id;

  try {
    const userDetails = await Details.find({ userId });
    res.status(200).json(userDetails);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Error fetching user details' });
  }
};

// Change password
const changePassword = async (req, res) => {
  const { newPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error.message);
    res.status(500).json({ error: 'Error changing password' });
  }
};

module.exports = {
  getUserDetails,
  changePassword,
};
