var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('./../lib/config');
var labels = config.modelLabels;
var dataset = config.datasetIDs;

var workflowSchema = new Schema({any: {}},{ bufferCommands: false });
var stepSchema = new Schema({
  _id: false,
  code: {
    type: String,
  },
  name: {
    type: String
  },
  templates: {
    form: {
      type: String
    },
    view: {
      type: String
    }
  }
}, { strict: false, versionKey: false });

mongoose.model('Step', stepSchema);

var workflowSchema = new Schema({
  id: {
    type: String
  },
  title: {
    type: String
  },
  steps: {
    type: [stepSchema]
  }
}, { strict: false, versionKey: false });



module.exports = function(db) {
  var model = db.model(dataset.WORKFLOW, workflowSchema, dataset.WORKFLOW);
  return model;
};