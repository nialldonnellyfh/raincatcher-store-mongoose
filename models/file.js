'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var config = require('./../lib/config');
var labels = config.modelLabels;
var dataset = config.datasetIDs;

var fileSchema = new Schema({
  id: ObjectId,
  workOrderId: {
    type: String,
  },
  localId: {
    type: String,
  },
  status: {
    type: String,
  },
  timeStamp: {
    type: Date,
    default: Date.now()
  },
  filePath: {
    type: String,
  },
  fileName: {
    type: String,
  },
  retries: {
    type: Number,
    default: 3
  }
});

module.exports = function(db) {
  var model = db.model(labels.FILE, fileSchema, dataset.FILE);
  return model;
};