const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const fs = require('fs');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    let places;
    try {
        places = await Place.find({ creator: userId });
    } catch (err) {
        const error = new HttpError(
            'Fetching places failed, please try again later',
            500
        );
        console.log(err);
        return next(error);
    }

    if (!places || places.length === 0) {
        return next(
            new HttpError(
                'could not find a place for the provided user id.',
                404
            )
        );
    }
    res.json({
        places: places.map((place) => place.toObject({ getters: true })),
    });
};

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId);
    } catch {
        (err) => {
            const error = new HttpError(
                'Something went wrong, could not find the place.',
                500
            );
            console.log(err);
            return next(error);
        };
    }

    if (!place) {
        const error = new HttpError(
            'could not find a place for the provided id.',
            404
        );
        return next(error);
    }
    res.json({ place: place.toObject({ getters: true }) });
};

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next(new HttpError('Invalid inputs passed, please check data', 422));
    }

    const { title, description, address } = req.body;
    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address);
    } catch (err) {
        return next(err);
    }

    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        // image: req.file.path,
        creator: req.userData.userId,
    });
    // checking if creator exists
    let user;

    try {
        user = await User.findById(req.userData.userId);
    } catch (err) {
        const error = new HttpError(
            'Creating place failed, please try again',
            500
        );
        console.log(err);
        return next(error);
    }

    if (!user) {
        const error = new HttpError(
            'Could not find user for provided id.',
            404
        );
        return next(error);
    }
    console.log(user);

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({ session: sess });
        user.places.push(createdPlace);
        await user.save({ session: sess });
        await sess.commitTransaction();
        sess.endSession();
    } catch (err) {
        const error = new HttpError(
            'Creating place failed, please try again.',
            500
        );
        console.log(err);
        return next(error);
    }
    res.status(201).json({ place: createdPlace });
};

const updatePlaceById = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(
            new HttpError('Invalid inputs passed, please check data', 422)
        );
    }

    const { title, description } = req.body;
    const { pid } = req.params;

    let place;
    try {
        place = await Place.findById(pid);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update place.',
            500
        );
        console.log(err);
        return next(error);
    }

    if (place.creator.toString() !== req.userData.userId) {
        const error = new HttpError(
            'You are not allowed to edit this place.',
            401
        );
        return next(error);
    }

    place.title = title;
    place.description = description;

    try {
        await place.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not save place.',
            500
        );
        console.log(err);
        return next(error);
    }

    res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeId).populate('creator');
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete place.',
            500
        );
        console.log(err);
        return next(error);
    }

    if (!place) {
        const error = new HttpError(
            'could not find place for provided id',
            404
        );
        return next(error);
    }

    if (place.creator.id !== req.userData.userId) {
        const error = new HttpError(
            'You are not allowed to delete this place.',
            401
        );
        return next(error);
    }

    const imagePath = place.image;

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.deleteOne({ session: sess });
        await place.creator.places.pull(place);
        await place.creator.save({ session: sess });
        await sess.commitTransaction();
        sess.endSession();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete place.',
            500
        );
        console.log(err);
        return next(error);
    }
    fs.unlink(imagePath, (err) => {
        console.log(err);
    });
    res.status(200).json({ message: 'deleted place.' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.deletePlace = deletePlace;
exports.updatePlaceById = updatePlaceById;
