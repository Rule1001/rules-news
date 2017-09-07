if (!process.env.Node_ENV) process.env.Node_ENV = 'dev';
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const config = require('./config');
const db = config.DB[process.env.Node_ENV] || process.env.DB;
const PORT = config.PORT[process.env.Node_ENV] || process.env.PORT;
const router = require('./routes/index');


mongoose.connect(db, err => {
    if (!err) {
        console.log(`connected to the Database: ${db}`);
    } else {
        console.log(`error connecting to the Database ${err}`);
    }
});

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());

app.use('/api', router);

// error handling
app.use((err, req, res, next) => {
    if (err.status) {
        return res.status(err.status).json({ message: err.message });
    }
    next();
});

app.use((err, req, res) => {
    res.status(500).json({ message: 'Server error!' });
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});

module.exports = app;