'use strict';
var Topics = require('fh-wfm-mediator/lib/topics');

module.exports = function decorate(Class) {
  Class.prototype.listen = function(topicPrefix, mediator) {
    var self = this;
    this.topics = new Topics(mediator);
    this.mediator = mediator;
    this.topics
      .prefix('wfm' + topicPrefix)
      .entity(self.datasetId)
      .on('create', function(object) {
        // needs a custom function because the created id is different
        // than the one in the request() topic
        var uid = object.id;
        self.create(object).then(function(createdObject) {
          self.mediator.publish([self.topics.getTopic('create', 'done'), uid].join(':'), createdObject);
        }).catch(function(err) {
          self.mediator.publish([self.topics.getTopic('create', 'error'), uid].join(':'), err);
        });
      })
      .on('read', self.read.bind(self))
      .on('update', self.update.bind(self))
      .on('delete', self.remove.bind(self))
      .on('list', self.list.bind(self));

    console.log('listening for: ', this.topics.getTopic());
  };

  Class.prototype.unsubscribe = function() {
    this.topics.unsubscribeAll();
  };
};