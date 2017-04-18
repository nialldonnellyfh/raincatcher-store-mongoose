var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('./../lib/config');
var labels = config.modelLabels;
var dataset = config.datasetIDs;

var stepSchema = new Schema({
  _id: false,
  code: {
    type: String
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
}, {timestamps: true});

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
}, { timestamps: true, strict: false, versionKey: false });



module.exports = function(db) {
  var model = db.model(labels.WORKFLOW, workflowSchema, dataset.WORKFLOW);
  return model;
};
