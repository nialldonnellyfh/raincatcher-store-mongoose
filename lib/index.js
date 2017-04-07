var modelSchemas = require('./../models');
var connector = require('fh-mongoose-connector');
var Promise = require('bluebird');
var Store = require('./mongoose-store');
var label = require('./config').module;
//var mongoose = require('mongoose');
//var Schema = mongoose.Schema;
var config = require('../lib/config');
//var labels = config.modelLabels;
var dataset = config.datasetIDs;

var MODELS = {};

function _addCollection(name, schema, db) {
  MODELS[name] = schema(db);
}

function _handleError(error) {
  console.error(label, error.toString());
  return Promise.reject(error);
}

function _connect(uri, opts) {
  return new Promise(function(resolve) {
    connector.connectToMongo(uri, opts).then(function(db) {
      Object.keys(modelSchemas).forEach(function(key) {
        var schema = modelSchemas[key];
        _addCollection(key, schema, db);
      });
      //MODELS[dataset.WORKORDERS] = db.model(dataset.WORKORDERS, new Schema({any: {}}, { bufferCommands: false }), dataset.WORKORDERS);
      //MODELS[dataset.RESULT] = db.model(dataset.RESULT, new Schema({any: {}}, { bufferCommands: false }), dataset.RESULT);
      //MODELS[dataset.WORKFLOW] = db.model(dataset.WORKFLOW, new Schema({any: {}}, { bufferCommands: false }), dataset.WORKFLOW);

      MODELS[dataset.RESULT].find({}).then(function(results){
        console.log('RESULTS*********', results);
      });

      //MODELS[dataset.WORKFLOW].find({}).then(function(results){
      //  console.log('WORKFLOW*********', results);
      //});
      //
      //MODELS[dataset.WORKORDERS].find({}).then(function(results){
      //  console.log('WORKORDERS*********', results);
      //});

      resolve(true);
    }, _handleError);
  });
}

function _disconnect() {
  return new Promise(function(resolve) {
    connector.closeConnection().then(function() {
      resolve(true);
    }, _handleError);
  });
}

function _getDAL(dataset) {
  return new Promise(function(resolve, reject) {
    var model = MODELS[dataset];
    var mongooseDal = new Store(dataset, model);
    if (mongooseDal) {
      resolve(mongooseDal);
    } else {
      reject(undefined);
    }
  });
}

module.exports = {
  getDAL: _getDAL,
  connect: _connect,
  disconnect: _disconnect
};