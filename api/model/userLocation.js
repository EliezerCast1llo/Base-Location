'use strict';
var db = require('../db');

let create = function(message, location, userId) {
  var data = new db.LocationModel({
    message,
    location,
    userId
  });
  return data.save();
};

//########### Queries ###########
let findByUserId = id => {
  return db.LocationModel.find({ userId: id })
    .exec()
    .then(location => {
      if (!location) {
        throw { statusCode: 404, message: 'location not found.' };
      }
      return location;
    });
};

// End ########### Queries ###########

module.exports = {
  create,
  findByUserId
};
