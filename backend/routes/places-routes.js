const express = require('express');
const router = express.Router();

const placesControllers = require('../controllers/places-controller');
const HttpError = require('../models/http-error');

router.get('/user/:uid', placesControllers.getPlaceByUserId);

router.get('/:pid', placesControllers.getPlaceById);

router.post('/', placesControllers.createPlace);

module.exports = router;
