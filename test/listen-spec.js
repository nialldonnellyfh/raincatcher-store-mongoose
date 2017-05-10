var mediator = require('fh-wfm-mediator/lib/mediator');
var sinon = require('sinon');
require('sinon-as-promised');
var decorate = require('../lib/listen');
var _ = require('lodash');

describe("Mongoose Store Listen", function() {

  var stubs = {
    read: sinon.spy(),
    update: sinon.spy(),
    remove: sinon.spy(),
    list: sinon.stub().resolves([]),
    create: sinon.spy()
  };

  var mockStore;

  var listTopic = "wfm:mockdatasetid:list";
  var doneListTopic = "done:wfm:mockdatasetid:list";
  var errorListTopic = "error:wfm:mockdatasetid:list";

  function MockStore(datasetId, model) {
    this.datasetId = datasetId;
    this.model = model;
  }

  MockStore.prototype.list = stubs.list;
  MockStore.prototype.read = stubs.read;
  MockStore.prototype.update = stubs.update;
  MockStore.prototype.create = stubs.create;
  MockStore.prototype.remove = stubs.remove;

  beforeEach(function() {
    _.each(stubs, function(stub) {
      stub.reset();
    });
  });

  afterEach(function() {
    mockStore.topics.unsubscribeAll();
  });

  it("should use default CRUDL functions for subscribers", function() {

    decorate(MockStore);

    mockStore = new MockStore("mockdatasetid");

    mockStore.listen("", mediator);

    var donePromise = mediator.promise(doneListTopic);

    mediator.publish(listTopic);

    return donePromise.then(function() {
      sinon.assert.calledOnce(stubs.list);
    });
  });

  it("should publish an error topic", function() {
    decorate(MockStore);

    var listErrorStub = sinon.stub().rejects(new Error("Error Listing"));

    mockStore = new MockStore("mockdatasetid");

    mockStore.listen("", mediator, {
      list: listErrorStub
    });

    var errorPromise = mediator.promise(errorListTopic);

    mediator.publish(listTopic);

    return errorPromise.then(function() {
      sinon.assert.calledOnce(listErrorStub);
    });
  });

  it("should allow for custom functions", function() {

    var customFunctions = {
      list: sinon.stub().resolves([])
    };

    mockStore = new MockStore("mockdatasetid");

    mockStore.listen("", mediator, customFunctions);

    var donePromise = mediator.promise(doneListTopic);

    mediator.publish(listTopic);

    return donePromise.then(function() {
      sinon.assert.calledOnce(customFunctions.list);
      sinon.assert.notCalled(stubs.list);
    });
  });

});