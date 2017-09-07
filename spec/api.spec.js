process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const request = require('supertest');
const server = require('../server');
const saveTestData = require('../seed/test.seed');
const config = require('../config');
const db = config.DB[process.env.NODE_ENV] || process.env.DB;
const mongoose = require('mongoose');

describe('API', () => {
    let usefulData;
    before((done) => {
        mongoose.connection.dropDatabase()
            .then(saveTestData)
            .then(data => {
                usefulData = data;
                console.log(`Useful data: ${Object.keys(usefulData)}`);
                done();
            })
            .catch((err) => {
                console.log(err);
                done(err);
            });
    });

    describe('GET /', () => {
        it('responds with status code 200', (done) => {
            request(server)
                .get('/api')
                .end((err, res) => {
                    if (err) done(err);
                    else {
                        expect(res.status).to.equal(200);
                        done();
                    }
                });
        });
        it('responds with status code 200', (done) => {
            request(server)
                .get('/api')
                .end((err, res) => {
                    if (err) done(err);
                    else {
                        expect(res.text).to.be.equal('Everything is fine!');
                        done();
                    }
                });
        });
    });
    describe('GET /api/topics', () => {
        it('returns a list of topics', (done) => {
            request(server)
                .get('/api/topics')
                .end((err, res) => {
                    if (err) done(err);
                    else {
                        expect(res.status).to.equal(200);
                        expect(res.body.topics.length).to.equal(3);
                        done();
                    }
                });
        });
    });
    describe('GET /api/topics/:topic_id/articles', () => {
        it('returns a list of articles from a single topic', (done) => {
            request(server)
                .get(`/api/topics/football/articles`)
                .end((err, res) => {
                    if (err) done(err);
                    else {
                        expect(res.status).to.equal(200);
                        expect(res.body.articles.length).to.equal(1);
                        done();
                    }
                });
        });
    });
    describe('GET /api/articles', () => {
        it('returns a list of all articles', (done) => {
            request(server)
                .get('/api/articles')
                .end((err, res) => {
                    if (err) done(err);
                    else {
                        expect(res.status).to.equal(200);
                        expect(res.body.articles.length).to.equal(2);
                        done();
                    }
                });
        });
    });

    describe('GET /api/articles/:article_id/comments', () => {
        it('returns a list of comments from a single article', (done) => {
            // console.log(usefulData);
            let articleId = usefulData.comments[0].belongs_to;
            // console.log('articleId: ' + articleId);
            request(server)
                .get(`/api/articles/${articleId}/comments`)
                .end((err, res) => {
                    if (err) done(err);
                    else {
                        expect(res.status).to.equal(200);
                        expect(res.body.comments.length).to.equal(2);
                        expect(res.body.comments).to.be.an('array');
                        done();
                    }
                });
        });
    });
    describe('POST /api/articles/:article_id/comments',  () => {
        it('adds a new comment to an article', (done) => {
            let articleId = usefulData.comments[0].belongs_to;
            request(server)
                .post(`/api/articles/${articleId}/comments`)
                .send({ comment: "Hello Phil" })
                .end((err, res) => {
                    if (err) done(err);
                    else {
                        expect(res.status).to.equal(200);
                        expect(res.body.comment.body).to.equal("Hello Phil");
                    }
                    done();
                });

        });
    });
    describe('PUT /api/articles/:article_id', function () {
        it('increments or decrements the votes of an article by 1', function (done) {
            // console.log('votes: ' + usefulData.articles[0].votes);
            let articleId = usefulData.articles[0]._id;
            request(server)
                .put(`/api/articles/${articleId}?vote=up`)
                .end((err, res) => {
                    if (err) done(err);
                    else {
                        // console.log(res.body);
                        expect(res.status).to.equal(200);
                        expect(res.body.article.votes).to.equal(1);
                    }
                    done();
                });
        });
        it('decrements the votes of an article by 1', function (done) {
            let articleId = usefulData.articles[0]._id;
            request(server)
                .put(`/api/articles/${articleId}?vote=down`)
                .end((err, res) => {
                    if (err) done(err);
                    else {
                        // console.log(res.body);
                        expect(res.status).to.equal(200);
                        expect(res.body.article.votes).to.equal(0);
                    }
                    done();
                });
        });
        it('does not decrease below 0', function (done) {
            let articleId = usefulData.articles[0]._id;
            request(server)
                .put(`/api/articles/${articleId}?vote=down`)
                .end((err, res) => {
                    if (err) done(err);
                    else {
                        // console.log(res.body);
                        expect(res.status).to.equal(200);
                        expect(res.body.article.votes).to.equal(0);
                    }
                    done();
                });
        });
    });

    describe('PUT /api/comments/:comment_id', function () {
        it('increments or decrements the votes of an comments by 1', function (done) {
            let commentId = usefulData.comments[0]._id;
            request(server)
                .put(`/api/comments/${commentId}?vote=up`)
                .end((err, res) => {
                    if (err) done(err);
                    else {
                        expect(res.status).to.equal(200);
                        expect(res.body.comment.votes).to.equal(1);
                    }
                    done();
                });
        });
    });
    it('decrements the votes of a comment by 1', function (done) {
        let commentId = usefulData.comments[0]._id;
        request(server)
            .put(`/api/comments/${commentId}?vote=down`)
            .end((err, res) => {
                if (err) done(err);
                else {
                    expect(res.status).to.equal(200);
                    expect(res.body.comment.votes).to.equal(0);
                }
                done();
            });
    });

});