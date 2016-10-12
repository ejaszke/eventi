'use strict';

import chai from 'chai';
import Crc from '../../src/classes/crc';


const assert = chai.assert;


describe('Crc generator', function() {

  it('generates 6 characters long pseudo random string', () => {
    assert.lengthOf(Crc.generate(6), 6);
  });

  it('generates 100 pseudo random strings', () => {
    for (let i=0; i<100; i++) {
      assert.notEqual(Crc.generate(6), Crc.generate(6));
    }
  });

});
