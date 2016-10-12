'use strict';

import chai from 'chai';
import Tpay from '../../src/classes/tpay';
import Client from '../../src/classes/client';
import queryString from 'query-string';


const assert = chai.assert;
const expect = chai.expect;

describe('TPAY generator', function() {

  it('generates correct tpay query string', () => {
    const options = {
      merchantId: 123,
      merchantCode: '123456'
    };

    const tpay = new Tpay(
                        options,
                        new Client(
                          'Peter',
                          'Griffin',
                          'peter@griffin.com'
                        ),
                        'abcabc'
    );

    const queryArray = queryString.parse(
                                tpay.generateQueryString(
                                  100.00,
                                  '/registration/response/success',
                                  '/registration/response/failure'
                                )
    );
    assert.equal(queryArray.md5sum, 'bf39912e93c440a8885e9c1179ba42e2');

  });

  it('throws exception for wrong amount', () => {
    const options = {
      merchantId: 123,
      merchantCode: '123456'
    };

    const tpay = new Tpay(
      options,
      new Client(
        'Peter',
        'Griffin',
        'peter@griffin.com'
      ),
      'abcabc'
    );

    assert.throws(
      () =>
        tpay.generateQueryString(
                    -1,
                    '/registration/response/success',
                    '/registration/response/failure'
        ),
      Error
    );

    assert.throws(
      () =>
        tpay.generateQueryString(
          0,
          '/registration/response/success',
          '/registration/response/failure'
        ),
      Error
    );

    assert.throws(
      () =>
        tpay.generateQueryString(
          'abc',
          '/registration/response/success',
          '/registration/response/failure'
        ),
      Error
    );

    assert.throws(
      () =>
        tpay.generateQueryString(
          null,
          '/registration/response/success',
          '/registration/response/failure'
        ),
      Error
    );

  });

});
