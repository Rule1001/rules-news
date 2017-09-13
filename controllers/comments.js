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
    console.log(req.body)
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

exports.voteComment = (req, res) => {
    let comment_id = req.params.comment_id;
    let vote = req.query.vote;
    let query;
    Comments.findById(comment_id)
        .then((comment) => {
            if (comment.votes <= 0 && vote === 'down') {
                return res.status(200).json({ comment });
            }
            if (vote === 'up') query = { $inc: { votes: 1 } };
            if (vote === 'down') query = { $inc: { votes: -1 } };
            return Comments.findByIdAndUpdate(comment_id, query, { new: true })
                .then((comment) => {
                    res.status(200).json({ comment });
                });
        }).catch((err) => {
            res.status(500).json(err);
        });
};

exports.deleteComment = (req, res) => {
    let comment_id = req.params.comment_id;
    Comments.findByIdAndRemove(comment_id)
        .then(() => {
            res.status(202).json({ message: 'comment deleted' });
        })
        .catch((err) => {
            res.status(500).json(err);
        });
};