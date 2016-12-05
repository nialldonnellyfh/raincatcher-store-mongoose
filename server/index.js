var _ = require('lodash');
var mongoose = require('mongoose');
var q = require('q');
var WFMMongooseEntity = require('./WFMMongooseEntity');


/**
 *
 * A single data store to manage a single Raincatcher Data Set.
 *
 * @param uri
 * @param options
 * @constructor
 */
function MongooseDataStore(uri, options) {
  this.uri = uri;
  this.options = options || {};
  this.entities = {};
}

/**
 * Registering a schema for the mongoose storage.
 * @param options
 * @param options.name
 * @param options.schema
 * @param options.customFunctions
 */
MongooseDataStore.prototype.addEntity = function (options) {
  this.entities[options.name] = new WFMMongooseEntity(options);
};


/**
 * Getting a single entity
 * @param entityId
 */
MongooseDataStore.prototype.getEntity = function(entityId) {
  return this.entities[entityId];
};


/**
 * Initialising the mongoose data store with the connection options.
 * 
 * TODO: Error states etc.
 * @returns {*|promise}
 */
MongooseDataStore.initialise = function() {
  var self = this;

  var mongoConnectionDefer = q.defer();

  //Waiting for a connection
  mongoose.once('connected', function() {
    mongoConnectionDefer.resolve();
  });

  //Connecting to mongoose
  mongoose.connect(this.uri, this.options);

  //Initialising each of the mongoose models.
  _.each(self.entities, function (entity){
    entity.initialise();
  });

  return mongoConnectionDefer.promise;
};


module.exports = MongooseDataStore;