'use strict';

import chai from 'chai';
import Client from '../../src/classes/client';


const assert = chai.assert;


describe('Client ', function() {

  it('returns Peter Griffin as name', () => {
    const client = new Client('Peter', 'Griffin', 'peter@griffin.com');
    assert.equal(client.name, 'Peter Griffin' );
    assert.equal(client.firstName, 'Peter');
    assert.equal(client.lastName, 'Griffin');
    assert.equal(client.email, 'peter@griffin.com');
  });

});
