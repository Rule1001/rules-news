const Comments = require('../models/comments');

exports.getCommentsByArticle = (req, res) => {
    let slug = req.params.article_id;
    Comments.find({ belongs_to: slug })
        .then((comments) => {
            res.json({ comments });
        })
        .catch((err) => {
            res.status(500).json(err);
        });
};