'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('./../lib/config');
var labels = config.modelLabels;
var dataset = config.datasetIDs;

var membershipSchema = new Schema({
  id: {
    type: String
  },
  group: {
    type: String
  },
  user: {
    type: String
  }
},  {timestamps: true});

module.exports = function(db) {
  var model = db.model(labels.MEMBERSHIP, membershipSchema, dataset.MEMBERSHIP);
  return model;
};