const User = require("../model").user;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const config = require("../config");

// Setup work and export for the JWT passport strategy
module.exports = function(passport) {
  passport.serializeUser((user, done) => {
    //creates a session with the local user id
    done(null, user.id);
  });

  //run when authorization ends
  passport.deserializeUser((id, done) => {
    //find the user USING THE _id
    User.findById(id)
      .then(user => done(null, user)) //req.user
      .catch(error => logger.log("error", "error deserializing user" + error));
  });

  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = config.sessionSecret;
  console.log("***!!!opts------------");
  console.log(opts);
  function tokenAuthProcessor(jwt_payload, done) {
    User.findById(jwt_payload._doc._id)
      .then(user => {
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      })
      .catch(error => {
        return done(err, false);
      });
  }

  const authGoogleProcesor = (accessToken, refreshToken, profile, done) => {
    //find a user usinf profile.id
    console.log("callback");
    User.findByExternalId(profile.id)
      .then(user => {
        console.log("user", user);
        if (user) {
          done(null, user);
        } else {
          console.log(profile);
          //create a new user
          User.createExternalUser(profile.emails[0].value, profile.id)
            .then(newUser => done(null, newUser))
            .catch(error =>
              console.error("error", "Error when creating user" + error)
            );
        }
      })
      .catch(error => {
        console.log(error);
        return done(err, false);
      });
  };

  passport.use(new JwtStrategy(opts, tokenAuthProcessor));

  // passport.use(new GoogleStrategy(config.google, authGoogleProcesor));
};
