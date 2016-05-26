var contains = require('../src/SmartContains').contains,
    chai = require("chai");

chai.should();

describe('SmartContains', function () {


  describe('contains should return true if there is the world in the String', function () {
    it('should return true if there is only the world in the string', function () {
      contains('test', 'test').should.equal(true);
    });
    it('should return true if there is only the world in the string', function () {
      contains('test ', 'test').should.equal(true);
    });
    it('should return true if there is only the world in the string', function () {
      contains(' test', 'test').should.equal(true);
    });
    it('should return true if there is only the world in the string', function () {
      contains(' test ', 'test').should.equal(true);
    });
    it('should return true if there is only the world in the string', function () {
      contains('test qsdf', 'test').should.equal(true);
    });
    it('should return true if there is only the world in the string', function () {
      contains('qsdf test', 'test').should.equal(true);
    });
    it('should return true if there is only the world in the string', function () {
      contains('qsdf test qsdf', 'test').should.equal(true);
    });
  });

  describe('contains should return false if there is the world isn\'t in the String', function () {
    it('as an empty string', function () {
      contains('', 'test').should.equal(false);
    });
    it('is an other world', function () {
      contains('toto', 'test').should.equal(false);
    });
    it('should return false if there is only the world isn\'t in the string', function () {
      contains('atest', 'test').should.equal(false);
    });
    it('should return false if there is only the world isn\'t in the string', function () {
      contains('testa', 'test').should.equal(false);
    });
    it('should return false if there is only the world isn\'t in the string', function () {
      contains('atesta', 'test').should.equal(false);
    });
  });
});