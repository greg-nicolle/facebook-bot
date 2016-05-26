var chai = require("chai");

require('../src/utils');

chai.should();

describe('Utils', function () {

  describe('normalise', function () {
    it('should\'nt change a normal string', function () {
      'test'.nrml().should.equal('test');
    });
    it('should lowercase some sting in uppercase', function () {
      'TEST'.nrml().should.equal('test');
    });
    it('should lowercase some sting in uppercase', function () {
      'TeSt'.nrml().should.equal('test');
    });
    it('should delete accent', function () {
      'éèêëàôöûüîï'.nrml().should.equal('eeeeaoouuii');
    });
  });

});