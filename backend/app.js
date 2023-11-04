const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('./models/http-error');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});

app.use('/api/places', placesRoutes); // => /api/places/....
app.use('/api/users', usersRoutes); // => /api/places/....

app.use((req, res, next) => {
    const error = new HttpError('Page not found.', 404);
    throw error;
});

app.get('/', (req, res) => {
    res.send('Namaste');
});

app.use((error, req, res, next) => {
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occoured' });
});

mongoose
    .connect(
        'mongodb+srv://pandeysiddhant21:t1kZ0r6hNvfwU84J@cluster0.tudekvq.mongodb.net/mern?retryWrites=true&w=majority'
    )
    .then(() => {
        app.listen(5000);
    })
    .catch((error) => {
        console.log(error);
    });
