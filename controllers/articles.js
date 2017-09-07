const Articles = require('../models/articles');

exports.getArticlesByTopic = (req, res, next) => {
    let { topic_id } = req.params;

    Articles.find({ belongs_to: topic_id })
        .then((articles) => {
            if (articles.length < 1) {
                return next({ status: 404, message: 'Topic not found' });
            }
            res.status(200).json({ articles });
        })
        .catch(next);
};

exports.getAllArticles = (req, res) => {
    Articles.find({})
        .then((articles) => {
            return res.json({ articles });
        })
        .catch((err) => {
            res.status(500).json(err);
        });
};

exports.voteArticle = (req, res) => {
    let articleId = req.params.article_id;
    let vote = req.query.vote;
    let query;
    Articles.findById(articleId)
        .then((article) => {
            if (article.votes <= 0 && vote === 'down') {
                return res.status(200).json({ article });
            }
            if (vote === 'up') query = { $inc: { votes: 1 } };
            if (vote === 'down') query = { $inc: { votes: -1 } };
            return Articles.findByIdAndUpdate({ _id: articleId }, query, { new: true })
                .then((article) => {
                    res.status(200).json({ article });
                });
        }).catch((err) => {
            res.status(500).json(err);
        });
};

