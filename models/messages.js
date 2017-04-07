var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('./../lib/config');
var labels = config.modelLabels;
var dataset = config.datasetIDs;

var messagesSchema = new Schema({

});

module.exports = function(db) {
  var model = db.model(labels.MESSAGES, messagesSchema, dataset.MESSAGES);
  return model;
};