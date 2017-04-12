'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('./../lib/config');
var labels = config.modelLabels;
var dataset = config.datasetIDs;

var groupSchema = new Schema({
  id: {
    type: String
  },
  name: {
    type: String
  },
  role: {
    type: String
  }
},  {timestamps: true});

module.exports = function(db) {
  var model = db.model(labels.GROUP, groupSchema, dataset.GROUP);
  return model;
};