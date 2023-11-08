const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const HttpError = require('./models/http-error');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.get('/', (req, res) => {
    res.send('<h1>Backend Working!</h1>');
});

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader(
//         'Access-Control-Allow-Headers',
//         'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//     );
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
//     next();
// });

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
    if (req.file) {
        fs.unlink(req.file.path, (err) => {
            console.log(err);
        });
    }
    if (res.headerSent) return next(error);
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occoured' });
});

mongoose
    .connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tudekvq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    )
    .then(() => {
        app.listen(5000);
    })
    .catch((error) => {
        console.log(error);
    });
