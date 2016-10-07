'use strict';

import chai from 'chai';
chai.should();

import chaiHttp from 'chai-http';
import assert from 'assert';
import authentication from 'feathers-authentication/client';
import bodyParser from 'body-parser';

const app = require('../../../src/app');
const Event = app.service('events');
const Registration = app.service('registrations');

var eventId;
var registrationId;

app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .configure(authentication());

chai.use(chaiHttp);

describe('registration service', function() {

    before((done) => {
        this.server = app.listen(3030);
        this.server.once('listening', () => {
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
    });

    after((done) => {
            Event.remove(null, () => {
                Registration.remove(null, () => {
                  this.server.close(function () {
                  });
                  done();
                });
            });
    });

    it('registered the registration service', () => {
        assert.ok(app.service('registrations'));
    });

    it('everyone could register to an event', (done) => {
      chai.request(app)
        .post('/registrations')
        .send({
          eventId: eventId,
          firstName: 'Los',
          lastName: 'Banditos',
          email: 'register@eventi.xxx',
          phone: '123123123',
          notes: 'Short note.',
          marketingAgreements: {
            register: true,
            marketing: true
          }
        })
        .end((err, res) => {
          res.body.should.have.property('eventId');
          res.body.eventId.should.equal(eventId);
          res.body.should.have.property('firstName');
          res.body.firstName.should.equal('Los');
          res.body.should.have.property('lastName');
          res.body.lastName.should.equal('Banditos');
          res.body.should.have.property('email');
          res.body.email.should.equal('register@eventi.xxx');
          res.body.should.have.property('phone');
          res.body.phone.should.equal('123123123');
          res.body.should.have.property('notes');
          res.body.notes.should.equal('Short note.');
          res.body.should.have.property('marketingAgreements');
          res.body.marketingAgreements.register.should.equal(true);
          res.body.marketingAgreements.marketing.should.equal(true);
          res.body.should.have.property('paymentLink');
          registrationId = res.body._id;
          done();
        });
    });

    it('everyone cant delete an registration', (done) => {
      chai.request(app)
        .delete('/registrations/' + registrationId)
        .send()
        .end((err, res) => {
          res.statusCode.should.equal(401);
          done();
        });
    });

    it('everyone cant list events', (done) => {
      chai.request(app)
        .get('/registrations')
        .send()
        .end((err, res) => {
          res.statusCode.should.equal(401);
          done();
        });
    });
});
