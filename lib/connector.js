'use strict';

var label = '[fh-mongoose] ';
var mongoose = require('mongoose');
var Promise = require('bluebird');

var handlers = {
  onError: function(err) {
    console.error(label, err.toString());
  },
  onConnection: function(uri) {
    console.info(label, 'Connected to Mongo @', uri);
  },
  onConnectionOpen: function() {
    console.info(label, 'Mongo connection open');
  },
  onClose: function() {
    console.info(label, 'Mongo connection closed');
  }
};

var Db = {};
Db.connection = {};

Db.connectToMongo = function(_uri, _opts) {
  return new Promise(function(resolve, reject) {
    _opts = _opts || {};
    mongoose.Promise = Promise;
    mongoose.connect(_uri, _opts);
    var _conn = mongoose.connection;
    _conn.mongoose = mongoose;
    _conn.once('open', function() {
      Db.connection = _conn;
      handlers.onConnectionOpen();
    }).on('error', function(error) {
      handlers.onError(error);
      reject(error);
    }).on('connected', function() {
      handlers.onConnection(_uri);
      resolve(_conn);
    });
  });
};

Db.getConfig= function() {
  var self = this;
  return new Promise(function(resolve) {
    // var self = Db;
    console.log(self);
    resolve(self.connection.config);
  });
};

Db.closeConnection= function() {
  var self = this;
  return new Promise(function(resolve) {
    self.connection.close(handlers.onClose);
    resolve(true);
  });
};

module.exports = Db;