'use strict';

var _ = require('lodash');
var Promise = require('bluebird');

/**
 *
 * Converting the mongoose document to a JSON object.
 *
 * @param mongooseDocument
 * @returns {JSON}
 */
function convertToJSON(mongooseDocument) {
  return mongooseDocument ? mongooseDocument.toJSON() : undefined;
}


function Store(_datasetId, _model) {
  this.model = _model;
  this.datasetId = _datasetId;
}

Store.prototype.init = function(data) {
  if (!_.isArray(data)) {
    console.log("Initialization data is not array.");
    return Promise.resolve();
  }
  var self = this;
  return Promise.map(data, function(entry) {
    var record = new self.model(entry);
    return record.save();
  });
};

Store.prototype.isPersistent = true;

Store.prototype.create = function(object) {
  var record = new this.model(object);
  return record.save();
};

Store.prototype.findById = function(id) {
  return this.model.findOne({id: id}).exec().then(convertToJSON);
};

Store.prototype.read = function(_id) {
  return this.model.findOne({id: _id}).exec().then(convertToJSON);
};

Store.prototype.update = function(object) {
  return this.model.findOne({id: object.id}).exec().then(function(foundDocument) {
    if (!foundDocument) {
      return Promise.reject(new Error("No document with id " + object.id  + " found"));
    } else {
      _.extend(foundDocument, object);
      return foundDocument.save();
    }
  }).then(convertToJSON);
};

/**
 *
 * @param object
 * @returns {Promise}
 */
Store.prototype.remove = function(object) {
  var id = object instanceof Object ? object.id : object;
  return this.model.findOneAndRemove({id: id}).then(convertToJSON);
};

/**
 *
 * Listing documents for a model.
 *
 * @param {object} filter - Optional filter to pass when listing documents for a model. (See https://docs.mongodb.com/manual/tutorial/query-documents/)
 */
Store.prototype.list = function(filter) {
  var _filter = {};
  if (filter) {
    _filter[filter.key] = filter.value;
  }
  return this.model.find(_filter).exec().then(function(arrayOfDocuments) {
    return _.map(arrayOfDocuments || [], convertToJSON);
  });
};

require('./listen')(Store);

module.exports = Store;