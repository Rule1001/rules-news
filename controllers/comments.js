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

exports.postNewComment = (req, res) => {
    let articleId = req.params.article_id;
    let comment = new Comments({
        body: req.body.comment,
        belongs_to: articleId
    });
    comment
        .save()
        .then((comment) => {
            res.send({ comment: comment });
        })
        .catch((err) => {
            res.status(500).json(err);
        });
};