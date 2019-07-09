const express = require('express');
const User = require('../model').user;
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config');
const passport = require('passport');
// Authenticate the user and get a JSON Web Token to include in the header of future requests.
router.post('/authenticate', function(req, res) {
    User.findByName(req.body.name)
        .then(user => {
            if (user) {
                return user.comparePassword(req.body.password)
                    .then((isMatch) => {
                        if (isMatch) {
                            return user;
                        } else {
                            throw 'Authentication failed. Passwords did not match.';
                        }
                    });

            } else {
                res.status(404);
                throw 'Authentication failed. User not found.';
            }

        })
        .then(user => {
            // Create token if the password matched and no error was thrown
            var token = jwt.sign(user, config.sessionSecret, {
                expiresIn: 10080 // in seconds
            });
            res.status(200);
            res.json({ success: true, token: 'JWT ' + token });
            return;
        })
        .catch(error => {
            if (res.statusCode >= 200 && res.statusCode <= 299) {
                res.status(400);
            }
            res.json({ success: false, message: error });
        });

});

router.get('/auth/google',
    passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    })
);

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });

module.exports = router;