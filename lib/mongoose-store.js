'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var buildQuery = require('./query-builder');

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

/**
 *
 * Creating an error describing a document that hasn't been found.
 *
 * @param {string} id - The ID of the document that wasn't found
 */
function createNoDocumentError(id) {
  var error = new Error("No document with id " + id  + " found");
  error.id = id;
  return Promise.reject(error);
}

/**
 *
 * Handling an error response that includes an ID.
 *
 * @param {string} id
 * @param {Error} err
 */
function handleError(id, err) {

  if (!(err instanceof Error)) {
    err = new Error(err);
  }

  err.id = id;

  return Promise.reject(err);
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
  return this.model.findOne({id: _id}).exec().then(function(foundDocument) {

    if (!foundDocument) {
      return createNoDocumentError(_id);
    }

    return foundDocument;
  }).then(convertToJSON).catch(function(err) {
    return handleError(_id, err);
  });
};

Store.prototype.update = function(object) {
  return this.model.findOne({id: object.id}).exec().then(function(foundDocument) {
    if (!foundDocument) {
      return createNoDocumentError(object.id);
    } else {
      _.extend(foundDocument, object);
      return foundDocument.save();
    }
  }).then(convertToJSON).catch(function(err) {
    return handleError(object.id, err);
  });
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
  filter = filter || {};

  var query = buildQuery(filter);

  var mongooseQuery = this.model.find(query);

  if (filter.sort && typeof filter.sort === 'object') {
    mongooseQuery.sort(filter.sort);
  }

  return mongooseQuery.exec().then(function(arrayOfDocuments) {
    return _.map(arrayOfDocuments || [], convertToJSON);
  });
};

Store.prototype.buildQuery = buildQuery;

require('./listen')(Store);

module.exports = Store;