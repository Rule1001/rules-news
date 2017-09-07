var models = require('../models/models');
var userData = require('./data/user_data.js');
var articleData = require('./data/articles');
var Chance = require('chance');
var chance = new Chance();
var _ = require('underscore');
var async = require('async');
var mongoose = require('mongoose');
var log4js = require('log4js');
var logger = log4js.getLogger();
var moment = require('moment');
var DBs = require('../config').DB;

mongoose.connect(DBs.dev, (err) => {
  if (!err) {
    logger.info(`connected to database ${DBs.dev}`);
    mongoose.connection.db.dropDatabase();
    async.waterfall([
      addUsers,
      addTopics,
      addArticles,
      addComments,
      addMasterUser
    ], (err) => {
      if (err) {
        logger.error('ERROR SEEDING :O');
        console.log(JSON.stringify(err));
        process.exit();
      }
      logger.info('DONE SEEDING!!');
      process.exit();
    });
  } else {
    logger.error('DB ERROR');
    console.log(JSON.stringify(err));
    process.exit();
  }
});

function addMasterUser(done) {
    var userDoc = new models.Users(
      {
        username: 'rule1001',
        name: 'rule1001',
        avatar_url: 'https://avatars3.githubusercontent.com/u/6791502?v=3&s=200'
      }
    );
    userDoc.save( (err) => {
      if (err) {
        return done(err);
      }
      return done();
    });
  }

  function addUsers(done) {
    logger.info('adding users');
    async.eachSeries(userData, function (user, cb) {
      var userDoc = new models.Users(user);
      userDoc.save(function (err) {
        if (err) {
          return cb(err);
        }
        return cb();
      });
    }, function (error) {
      if (error) return done(error);
      return done(null);
    });
  }

  function addTopics(done) {
    logger.info('adding topics');
    var topicDocs = [];
    async.eachSeries(['Football', 'Cooking', 'Coding'], function (topic, cb) {
      var topicObj = {
        title: topic,
        slug: topic.toLowerCase()
      };
      var topicDoc = new models.Topics(topicObj);
      topicDoc.save(function (err, doc) {
        if (err) {
          logger.error(JSON.stringify(err));
          return cb(err);
        }
        logger.info(JSON.stringify(doc));
        topicDocs.push(topicObj);
        return cb();
      });
    }, function (error) {
      if (error) return done(error);
      return done(null, topicDocs);
    });
  }
