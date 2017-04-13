var modelSchemas = require('./../models');
var connector = require('./connector');
var Promise = require('bluebird');
var Store = require('./mongoose-store');
var label = require('./config').module;
var _ = require('lodash');

var MODELS = {};

function _addCollection(name, schema, db) {
  MODELS[name] = schema(db);
}

function _handleError(error) {
  console.error(label, error.toString());
  return Promise.reject(error);
}

/**
 *
 * Function to connect to mongoose and set up models based on schemas.
 *
 * Users have the option to set their own custom schemas if required.
 *
 * @param {string} mongoUrl - A valid mongodb connection URL
 * @param {object} options - Any custom connection parameters for the mongoose connection
 * @param {object} [customSchemas] - Optional Custom schemas passed by the application.
 * @returns {bluebird|exports|module.exports}
 */
function connect(mongoUrl, options, customSchemas) {

  //The default dataset schemas to use will be the ones passed by the user
  var schemasToUse = _.defaults(customSchemas, modelSchemas);

  return new Promise(function(resolve) {
    connector.connectToMongo(mongoUrl, options).then(function(db) {
      _.each(schemasToUse, function(schema, key) {
        _addCollection(key, schema, db);
      });
      resolve(true);
    }, _handleError);
  });
}

function disconnect() {
  return new Promise(function(resolve) {
    connector.closeConnection().then(function() {
      resolve(true);
    }, _handleError);
  });
}

function getDataAccessLayer(dataset) {
  return new Promise(function(resolve, reject) {
    var model = MODELS[dataset];
    if (!model) {
      return reject(new Error("Invalid model for dataset " + dataset));
    }
    var mongooseDal = new Store(dataset, model);
    resolve(mongooseDal);
  });
}


module.exports = {
  getDAL: getDataAccessLayer,
  connect: connect,
  disconnect: disconnect
};