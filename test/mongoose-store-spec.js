'use strict';

var config = require('./../lib/config');
var assert = require('assert');
var Models = require('./../models');
var Connector = require('./../lib');
var mongoose = require('mongoose');
var expect = require('expect');
var _ = require('lodash');

var mongoUri = 'mongodb://localhost:27017/raincatcher-mongo-connector';

describe(config.module, function() {
  var testDal = {};
  var testDoc = {};


  it('should use custom schemas if passed', function(done) {
    var customWorkorderSchema = new mongoose.Schema({
      name: {type: String, required: true}
    });
    var customWorkorderModel;

    var customDataSetModels = {
      workorders: function(mongooseConnection) {
        customWorkorderModel = mongooseConnection.model("Workorders", customWorkorderSchema);
        return customWorkorderModel;
      }
    };

    Connector.connect(mongoUri, {}, customDataSetModels).then(function() {
      assert.ok(customWorkorderModel, "Expected workorder model to be defined");

      Connector.getDAL('workorders').then(function(dal) {
        assert.strictEqual(customWorkorderModel, dal.model, "Expected the custom workroder model instead of the default");
        done();
      });

    });
  });

  it('should handle validation errors', function() {
    return Connector.getDAL('workorders').then(function(dal) {

      return dal.create({}).then(function() {
        throw "Expected No Error";
      }).catch(function(err) {
        expect(err.message).toBeA('string');
        expect(err.message).toContain("ValidationError");
        expect(err.message).toContain("workorders");
        expect(err.message).toContain("name");
        expect(err.message).toContain("required");
      });
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
      id: "testid",
      status: 'test',
      _localuid: "localid",
      workorderId: '1234567890'
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

  it('should update with a local id', function(done) {
    testDal.update(_.omit(testDoc, 'id')).then(function(result) {
      testDoc = result;
      done(assert.equal(result._localuid, 'localid'));
    }, function(error) {
      done(error);
    });
  });

  it('should return an error if no record exists', function(done) {
    var id = "idontexist";
    testDal.read(id).then(function() {
      done(new Error("Expected an error"));
    }, function(error) {
      assert.ok(error, "Expected an error");
      done();
    });
  });

  it('should read test record', function(done) {
    var id = testDoc.id;
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
