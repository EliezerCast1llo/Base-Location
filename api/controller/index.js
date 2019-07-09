'use strict';
const express = require('express');
const router = express.Router();

router.use(
  '/',
  require('./person'),
  require('./authController'),
  require('./registerController'),
  require('./productController'),
  require('./test'),
  require('./locationController')
);

module.exports = router;
