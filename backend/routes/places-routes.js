const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const placesControllers = require('../controllers/places-controller');
const HttpError = require('../models/http-error');

router.post(
    '/',
    [
        check('title').not().isEmpty(),
        check('description').isLength({ min: 5 }),
        check('address').not().isEmpty(),
    ],
    placesControllers.createPlace
);

router.get('/:pid', placesControllers.getPlaceById);
router.get('/user/:uid', placesControllers.getPlacesByUserId);

router.patch(
    '/:pid',
    [check('title').not().isEmpty(), check('description').isLength({ min: 5 })],
    placesControllers.updatePlaceById
);

router.delete('/:pid', placesControllers.deletePlace);

module.exports = router;
