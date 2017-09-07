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
      addRule1001User
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