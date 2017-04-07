'use strict';
var Topics = require('fh-wfm-mediator/lib/topics');

module.exports = function decorate(Class) {
  Class.prototype.listen = function(topicPrefix, mediator) {

    var self = this;
    this.topics = new Topics(mediator);
    this.mediator = mediator;
    this.topics
      .prefix('wfm' + topicPrefix)
      .entity(this.datasetId)
      .on('create', function(object) {
        // needs a custom function because the created id is different
        // than the one in the request() topic
        var uid = object.id;
        self.create(object).then(function(object) {
          self.mediator.publish([self.topics.getTopic('create', 'done'), uid].join(':'), object);
        });
      })
      .on('read', function(id){
          var uid = id;
          self.read(uid).then(function(object){
              self.mediator.publish([self.topics.getTopic('read', 'done'), uid].join(':'), object);
          });
          //TODO add catch
      })
      .on('update', function(object){
          var uid = object.id;
          self.update(object).then(function(object){
              self.mediator.publish([self.topics.getTopic('update', 'done'), uid].join(':'), object.id);
          });
      })
      .on('delete', function(object){
          var uid = object.id;
          self.delete(object).then(function(object){
              self.mediator.publish([self.topics.getTopic('delete', 'done'), uid].join(':'), object.id);
          });
      })
      .on('list', function(filter){
          self.list(filter).then(function(object){
              self.mediator.publish(self.topics.getTopic('list', 'done'), object);
          });
      })

      console.log('listening for: ', this.topics.getTopic());
  };

  Class.prototype.unsubscribe = function() {
    this.topics.unsubscribeAll();
  };
};