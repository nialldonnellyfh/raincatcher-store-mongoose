'use strict';

var config = require('./../lib/config');
var assert = require('assert');
var Models = require('./../models');
var Connector = require('./../lib');
var DB = {};

var mongoUri = 'mongodb://localhost:27017/raincatcher-mongo-connector';

describe(config.module, function() {
  var testDal = {};
  var testDoc = {};

  it('should connect to test db', function(done) {
    this.timeout(2000);
    Connector.connect(mongoUri, {}).then(function(db) {
      DB = db;
      done(assert.equal(DB, db));
    }, function(error) {
      done(error);
    });
  });

  it('should return an instance of workorders model', function(done) {
    Connector.getDAL('workorders', Models.workorders).then(function(_dal) {
      _dal.init({}).then(function() {
        done();
      }, function(error) {
        done(error);
      });
    }, function(error) {
      done(error);
    });
  });

  it('should return an instance of workflows data access layer', function(done) {
    Connector.getDAL('workflows', Models.workflows).then(function(_dal) {
      _dal.init({}).then(function() {
        done();
      }, function(error) {
        done(error);
      });
    }, function(error) {
      done(error);
    });
  });

  it('should return an instance of result data access layer', function(done) {
    Connector.getDAL('result', Models.result).then(function(_dal) {
      testDal = _dal;
      _dal.init({}).then(function() {
        done();
      }, function(error) {
        done(error);
      });
    }, function(error) {
      done(error);
    });
  });

  it('should add item to result collection', function(done) {
    testDal.create({
      status: 'test',
      workorderId: '1234567890',
    }).then(function(doc) {
      testDoc = doc;
      done(assert.equal(testDoc.status, 'test'));
    }, function(error) {
      done(error);
    });
  });

  it('should return a list of test records', function(done) {
    testDal.list().then(function(results) {
      done(assert.equal(results && results.length > 0, true));
    }, function(error) {
      done(error);
    });
  });

  it('should update test record', function(done) {
    var id = testDoc.id;
    testDal.update(testDoc).then(function(result) {
      testDoc = result;
      done(assert.equal(result.id, id));
    }, function(error) {
      done(error);
    });
  });

  it('should read test record', function(done) {
    var id = testDoc._id;
    testDal.read(id).then(function() {
      done();
    }, function(error) {
      done(error);
    });
  });

  it('should find test record by ID', function(done) {
    var id = testDoc.id;
    testDal.findById(id).then(function(result) {
      done(assert.equal(id, result.id));
    }, function(error) {
      done(error);
    });
  });

  it('should remove test record', function(done) {
    testDal.remove(testDoc).then(function() {
      done();
    }, function(error) {
      done(error);
    });
  });

  it('should close connection to db', function(done) {
    Connector.disconnect().then(function() {
      done();
    }, function(error) {
      done(error);
    });
  });
});
