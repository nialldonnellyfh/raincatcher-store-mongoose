var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('./../lib/config');
var labels = config.modelLabels;
var dataset = config.datasetIDs;

var resultSchema = new Schema({
  status: {
    type: String
  },
  workorderId: {
    type: String
  },
  _localuid: {
    type: String
  },
  id: {
    type: String
  },
  nextStepIndex: {
    type: String
  },
  stepResults: Schema.Types.Mixed
}, {timestamps: true});

module.exports = function(db) {
  var model = db.model(labels.RESULT, resultSchema, dataset.RESULT);
  return model;
};