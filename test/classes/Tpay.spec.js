'use strict';

import chai from 'chai';
import Tpay from '../../src/classes/tpay';
import Client from '../../src/classes/client';
import queryString from 'query-string';
import bodyParser from 'body-parser';
const authentication = require('feathers-authentication/client');
import chaiHttp from 'chai-http';
const assert = chai.assert;
const expect = chai.expect;

const app = require('../../src/app');
const Event = app.service('events');

let eventId = '';

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(authentication());

chai.use(chaiHttp);


describe('TPAY generator', function() {

  before((done) => {
    Event.create({
      'title': 'Event One',
      'price': 100,
      'city': 'Katowice',
      'description': 'Event description.'
    }, (err, data) => {
      eventId = data._id;
      done();
    });
  });

  it('generates correct tpay query string', () => {

    Event.get(eventId)
      .then(event => {

        const options = {
          merchantId: 123,
          merchantCode: '123456',
          price: event.price,
          description: event.title
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
  });

  it('throws exception for wrong amount', () => {
    const options = {
      merchantId: 123,
      merchantCode: '123456',
      price: -1,
      description: 'description'
    };

    assert.throws(
      () =>
      {
        const tpay = new Tpay(
          options,
          new Client(
            'Peter',
            'Griffin',
            'peter@griffin.com'
          ),
          'abcabc'
        );
      },
      Error
    );

  });

});
