var mongoose = require('mongoose');

// Schema defines how the data will be stored in MongoDB
var LocationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  message: {
    type: String
  },
  location: {
    type: String
  },
  inserted: {
    type: Date,
    required: true,
    default: Date.now
  }
});

module.exports = LocationSchema;
