const express = require('express');

const { getUser } = require('../controllers/users');
const { getAllTopics } = require('../controllers/topics');
const { getAllArticles, getArticlesByTopic, voteArticle  } = require('../controllers/articles');
const { getCommentsByArticle, postNewComment, deleteComment, voteComment} = require('../controllers/comments');

const router = express.Router();

router.get('/', (req, res) => res.send('Everything is fine!'));
router.get('/topics', getAllTopics);
router.get('/topics/:topic_id/articles', getArticlesByTopic);
router.get('/articles', getAllArticles);
router.get('/articles/:article_id/comments', getCommentsByArticle);

router.post('/articles/:article_id/comments', postNewComment);

router.put('/articles/:article_id', voteArticle);
router.put('/comments/:comment_id', voteComment);

router.delete('/comments/:comment_id', deleteComment);

router.get('/users/:username', getUser);

module.exports = router;