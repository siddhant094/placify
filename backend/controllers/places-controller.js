const HttpError = require('../models/http-error');

const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        location: {
            lat: 40.74,
            lng: -73.98,
        },
        address: '20 W 34th St., New York, NY 10001, United States',
        creator: 'u1',
    },
];

const getPlaceByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const place = DUMMY_PLACES.find((p) => {
        return p.creator === userId;
    });

    if (!place) {
        throw new HttpError(
            'could not find a place for the provided user id.',
            404
        );
    }
    res.json(place);
};

const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find((p) => p.id === placeId);

    if (!place) {
        throw new HttpError('could not find a place for the provided id.', 404);
    }
    res.json(place);
};

const createPlace = (req, res, next) => {
    const { title, description, coordinates, address, creator } = req.body;
    const createdPlace = {
        title,
        description,
        location: coordinates,
        address,
        creator,
    };
    DUMMY_PLACES.push(createdPlace);
    res.send(201).json(createPlace);
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
