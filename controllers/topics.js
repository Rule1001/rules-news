const Topics = require('../models/topics');

exports.getAllTopics = (req, res) => {
    Topics.find({})
    .then((topics) => {
        res.json({ topics });
    })
    .catch((err) => {
        res.status(500).json(err);
    });
};