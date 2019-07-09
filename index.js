'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const appmodules = require('./api');
const passport = require('passport');
const google = require('googleapis');
const gaConfig = require('./api/config/elvis-store-50f5c66baa8c.json');
const cors = require('cors');

app.set('port', process.env.PORT || 3000);
app.use(cors());
// app.use(express.static('dist'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  let jwtClient = new google.auth.JWT(
    gaConfig.client_email,
    null,
    gaConfig.private_key,
    ['https://www.googleapis.com/auth/analytics.readonly'],
    null
  );
  jwtClient.authorize(function(err, tokens) {
    if (err) {
      console.log(err);
      //return;
    }
    console.log('toeken:', tokens);
    res.render('index', {
      host: appmodules.config.host,
      gtoken: tokens.access_token
    });
  });
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Initialize passport for use
app.use(passport.initialize());

// Bring in defined Passport Strategy
appmodules.auth(passport);

app.use('/api', appmodules.router);

// always return  index for angular routing
// app.all('*', (req, res) => {
//   res.status(200).sendFile(__dirname + '/dist/index.html');
// });

app.listen(
  app.get('port'),
  console.log('person service running on port ', app.get('port'))
);
