process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const request = require('supertest');
const server = require('../server');
const saveTestData = require('../seed/test.seed');
const config = require('../config');
const db = config.DB[process.env.NODE_ENV] || process.env.DB;
const mongoose = require('mongoose');

describe('API', function () {
    this.timeout(10000);
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

    describe('GET /', function () {
        it('responds with status code 200', function (done) {
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
        it('responds with status code 200', function (done) {
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
    describe('GET /api/topics', function () {
        it('returns a list of topics', function (done) {
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
    describe('GET /api/topics/:topic_id/articles', function () {
        it('returns a list of articles from a single topic', function (done) {
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

});