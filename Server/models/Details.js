const mongoose = require('mongoose');

const detailsSchema = new mongoose.Schema({
  destination: {
    type: String,
    required: true
  },
  attraction: {
    type: String,
    required: true
  },
  flight: {
    type: String,
    required: true
  },
  weather: {
    type: String,
    required: true
  }
});

const Details = mongoose.model('Details', detailsSchema);

module.exports = Details;
