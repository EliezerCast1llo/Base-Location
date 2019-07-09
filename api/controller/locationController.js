'use strict';
const url = require('url');
const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const config = require('../config');
const UserLocation = require('../model').UserLocation;
function resolveProducts(req, res, promise) {
  promise
    .then(products => {
      res.status(200);
      res.json(products);
    })
    .catch(error => {
      errorResponse(res, error);
    });
}
function errorResponse(res, error) {
  let content = { success: false, message: error };

  //if the response has ok code
  if (res.statusCode >= 200 && res.statusCode <= 299) {
    //if the error contains statuscode
    if (error.statusCode && !isNaN(parseFloat(error.statusCode))) {
      res.status(error.statusCode);
      content.message = error.message;
    } else {
      res.status(400);
    }
  }
  res.json(content);
}

router.get('/location/', middleware.loginRequired, function(req, res) {
  let userId = req.user._id;
  resolveProducts(req, res, UserLocation.findByUserId(userId));
});

router.post('/location/', middleware.loginRequired, function(req, res) {
  let newLocation = req.body;
  let userId = req.user._id;
  let uri = url.parse(req.originalUrl);
  UserLocation.create(newLocation.message, newLocation.location, userId)
    .then(location => {
      res.status(201);
      res.set({ Location: `${config.host}${uri.pathname}${location._id}` });
      res.json(location);
    })
    .catch(error => {
      errorResponse(res, error);
    });
});

module.exports = router;
