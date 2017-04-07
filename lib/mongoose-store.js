'use strict';

var shortid = require('shortid');
var _ = require('lodash');

var extractListFields = function(records) {

  if (!_.isArray(records)) {
    return records;
  }

  var list = [];
  records.forEach(function(rec) {
    list.push(rec.toObject());
  });

  return list;
};

function Store(_datasetId, _model) {
  this.model = _model;
  this.datasetId = _datasetId;
}

// do not want to create a new record on creation of a new store
Store.prototype.init = function(data) {
  console.log('mongoose-store doing init--- ', this.datasetId + ' : ' + data);
  //var record = new this.model(data);

  return {};//record.save();
};

Store.prototype.isPersistent = true;

Store.prototype.create = function(object) {
  console.log('do create--- ', this.datasetId + ' :object: ' + object);
  object.id = shortid.generate();
  var record = new this.model(_.clone(object));
  return record.save(); //.then(_.property('fields'));
};

Store.prototype.findById = function(id) {
  console.log('do findById--- ', this.datasetId + ' :id: ' + id);
  // use 'list' since 'read' can only filter by guid === mongo's ObjectId
  return this.model.findOne({id: id}).then(extractListFields);
};

Store.prototype.read = function(_id) {
  console.log('do read--- ', this.datasetId + ' :_id: ' + _id);
  return this.model.findOne({id: _id}).then(extractListFields);
};

Store.prototype.update = function(object) {
  console.log('do update--- ', this.datasetId + ' :object: ' + object);
  // delete _id to stop mongo complaining on update
  delete object._id;
  return this.model.findOneAndUpdate({
    id: object.id
  }, object, {
    upsert: true // create if doesn't exist
  }).then(extractListFields);
};

Store.prototype.delete = function(object) {
  var id = object instanceof Object ? object.id : object;

  return this.model.findOneAndRemove({id: id});
};

Store.prototype.list = function(filter) {
  var _filter = {};
  var _sort = {
    ticketNumber: 'asc' // or 'desc'
  };
  console.log('do list--- ', this.datasetId);

  if (filter) {
    _filter[filter.key] = filter.value;
    // if (filter.eq) {
    //   _filter = {
    //     $eq: filter.eq
    //   };
    // }
    // if (filter.in) {
    //   _filter = filter.in
    // }
    // if (filter.sort) {
      // _sort = filter.sort;
  }

  return this.model.find(_filter).then(extractListFields);
};

require('./listen')(Store);

module.exports = Store;