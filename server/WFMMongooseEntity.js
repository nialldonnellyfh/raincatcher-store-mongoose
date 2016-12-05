var _ = require('lodash');
var mongoose = require('mongoose');

/**
 * Managing a single mongoose entity
 * @param options
 * @param options.name
 * @param options.schema
 * @param options.customFunctions  - Func
 * @constructor
 */
function WFMMongooseEntity(options) {
  var self = this;
  self.name = options.name;
  self.schema = options.schema;
  self.customFunctions = {};
}

/**
 * Initialising a single mongoose model on the default connection
 */
WFMMongooseEntity.prototype.initialise = function() {
  this.model = mongoose.model(this.name, this.schema);
};

module.exports = WFMMongooseEntity;