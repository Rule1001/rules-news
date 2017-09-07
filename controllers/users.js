const Users = require('../models/users');

exports.getUser = (req, res) => {
    let username = req.params.username;
     Users.findOne({username})
        .then((user) => {
            res.status(200).json({user});
        })
        .catch((err) => {
            res.status(500).json(err);
        });
};