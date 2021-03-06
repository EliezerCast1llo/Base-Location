var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

// Schema defines how the user data will be stored in MongoDB
var UserSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: false
  },
  role: {
    type: String,
    enum: ['Client', 'Manager', 'Admin'],
    default: 'Client'
  },
  externalId: {
    type: String,
    required: false
  }
});

// Saves the user's password hashed (plain text password storage is not good)
UserSchema.pre('save', function (next) {
  console.log("pre save user +++");
  var user = this;
  if (!user.password) {
    return next();
  }
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

// Create method to compare password input to password saved in database
UserSchema.methods.comparePassword = function (pw, cb) {
  return bcrypt.compare(pw, this.password);


};
module.exports = UserSchema;