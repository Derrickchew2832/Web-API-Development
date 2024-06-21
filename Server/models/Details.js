const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  source: String,
  price: String,
  departure: String,
  arrival: String,
  class: String,
  duration: String,
  airline: String,
  aircraft: String,
  type: String,
  travelers: [String] // This can be further broken down if needed
});

const detailsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  destination: {
    type: String,
    required: true
  },
  attraction: [{
    name: String,
    description: String,
    photoUrl: String
  }],
  flight: [flightSchema],
  weather: {
    description: String,
    temperature: String,
    time: String,
    date: String
  }
});

const Details = mongoose.model('Details', detailsSchema);

module.exports = Details;
