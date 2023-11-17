const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const fileUpload = require('../middleware/file-upload');
const HttpError = require('../models/http-error');

const usersControllers = require('../controllers/users-controller');
router.get('/', usersControllers.getUsers);

// const multer = require('multer');
// const HttpError = require('../models/http-error');
// const upload = fileUpload.single('image');

router.post(
    '/signup',
    fileUpload.single('image'),
    [
        check('name').not().isEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({ min: 6 }),
    ],
    usersControllers.signup
);

router.post('/login', usersControllers.login);

module.exports = router;
