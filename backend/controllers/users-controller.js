const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const fileUpload = require('../middleware/file-upload');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password');
    } catch (err) {
        const error = new HttpError(
            'Fetching users failed, please try again later.',
            500
        );
        console.log(err);
        return next(error);
    }
    res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
    // console.log('HERE0');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        res.status(422);
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    // console.log('HERE1');

    const { name, email, password } = req.body;

    // console.log('HERE2');
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again later.',
            500
        );
        console.log(err);
        return next(error);
    }
    // console.log('HERE3');
    if (existingUser) {
        const error = new HttpError(
            'User exists already, please login instead.',
            422
        );
        return next(error);
    }
    let hashedPassword;
    // const saltRounds = 10;
    try {
        // bcrypt.genSalt(saltRounds, function (err, salt) {
        //     bcrypt.hash(password, salt, function (err, hash) {
        //         // returns hash
        //         hashedPassword = hash;
        //         // console.log(hash);
        //     });
        // });
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new HttpError(
            'Could not create user, please try again.' + err.message,
            500
        );
        console.log(err);
        return next(error);
    }
    // console.log('HERE4');
    const createdUser = new User({
        name,
        email,
        image: req.file.path,
        password: hashedPassword,
        places: [],
    });
    // console.log(createdUser);
    try {
        // console.log('saving user');
        await createdUser.save();
    } catch {
        (err) => {
            const error = new HttpError(
                'Signing up failed, please try again later.',
                500
            );
            console.log(err);
            return next(error);
        };
    }

    let token;
    try {
        token = jwt.sign(
            { userId: createdUser.id, email: createdUser.email },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
        );
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again later.',
            500
        );
        console.log(err);
        return next(error);
    }
    console.log('HERE5');
    res.status(201).json({
        userId: createdUser.id,
        email: createdUser.email,
        token: token,
    });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            'Logging in failed, please try again later.',
            500
        );
        console.log(err);
        return next(error);
    }

    if (!existingUser) {
        const error = new HttpError(
            'Invalid credentials, could not log you in.',
            403
        );
        return next(error);
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
        console.log(password + '  ' + existingUser.password);
    } catch (err) {
        const error = new HttpError(
            'Could not log you in, please check your credentials and try again.',
            500
        );
        console.log(err);
        return next(error);
    }

    if (!isValidPassword) {
        const error = new HttpError(
            'Invalid credentials, could not log you in.',
            403
        );
        return next(error);
    }

    let token;
    try {
        token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
        );
    } catch (err) {
        const error = new HttpError(
            'Logging in failed, please try again later.',
            500
        );
        console.log(err);
        return next(error);
    }

    res.json({
        userId: existingUser.id,
        email: existingUser.email,
        token: token,
    });

    // res.json({
    //     message: 'Loggged in!',
    //     user: existingUser.toObject({ getters: true }),
    // });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
