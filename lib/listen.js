'use strict';
var Topics = require('fh-wfm-mediator/lib/topics');
var _ = require('lodash');


/**
 *
 * Creating a new object to be saved as a mongoose document
 *
 * @param objectToCreate
 */
function create(objectToCreate) {
  var self = this;
  // needs a custom function because the created id is different
  // than the one in the request() topic
  var uid = objectToCreate.id;

  self.create(objectToCreate).then(function(createdObject) {
    self.mediator.publish([self.topics.getTopic('create', 'done'), uid].join(':'), createdObject);
  }).catch(function(err) {
    self.mediator.publish([self.topics.getTopic('create', 'error'), uid].join(':'), err);
  });
}

module.exports = function decorate(Class) {

  /**
   *
   * Registering subscribers for CRUDL topics a single data set.
   *
   * The `customFunctions` parameter allows overriding any of the CRUDL functions
   *
   * E.g.
   *
   * {
   *   ...
   *   list: function customListFunction() {}
   *   ...
   * }
   *
   * @param {string} topicPrefix
   * @param {Mediator} mediator
   * @param {object} [customFunctions] - Optional overrides for the dataset functions function
   */
  Class.prototype.listen = function(topicPrefix, mediator, customFunctions) {
    customFunctions = customFunctions || {};

    var self = this;

    //Applying any custom crudl functions
    var crudlFunctions = _.defaults(customFunctions, {
      read: self.read,
      update: self.update,
      remove: self.remove,
      list: self.list,
      create: create
    });

    //Binding the crudl functions to the Store class.
    //This will give them access to the `model` property to perform queries etc.
    crudlFunctions = _.mapValues(crudlFunctions, function(crudlFunction, functionName) {
      if (!_.isFunction(crudlFunction)) {
        throw new Error("Expected a function for custom function " + functionName + " but got " + typeof crudlFunction);
      }

      return _.bind(crudlFunction, self);
    });

    this.topics = new Topics(mediator);
    this.mediator = mediator;
    this.topics
      .prefix('wfm' + topicPrefix)
      .entity(self.datasetId)
      .on('create', crudlFunctions.create)
      .on('read', crudlFunctions.read)
      .on('update', crudlFunctions.update)
      .on('delete', crudlFunctions.remove)
      .on('list', crudlFunctions.list);

    console.log('listening for: ', this.topics.getTopic());
  };

  Class.prototype.unsubscribe = function() {
    this.topics.unsubscribeAll();
  };
};