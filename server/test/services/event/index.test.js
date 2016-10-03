'use strict';

import chai from 'chai';
chai.should();

import chaiHttp from 'chai-http';
import assert from 'assert';
import authentication from 'feathers-authentication/client';
import bodyParser from 'body-parser';

const app = require('../../../src/app');
const Event = app.service('events');
const User = app.service('users');

var adminToken;
var userToken;
var eventId;

app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .configure(authentication());

chai.use(chaiHttp);

describe('event service', function() {

    before((done) => {
        this.server = app.listen(3030);
        this.server.once('listening', () => {

            Event.create({
              'email': 'admin@eventi.xxx',
              'password': 'admin'
            });

            User.create({
                'email': 'admin@eventi.xxx',
                'password': 'admin',
                'roles': ['admin']
            }, () => {
                //setup a request to get authentication token
                chai.request(app)
                    .post('/auth/local')
                    .set('Accept', 'application/json')
                    .send({
                        'email': 'admin@eventi.xxx',
                        'password': 'admin'
                    })
                    .end((err, res) => {
                        adminToken = res.body.token;
                        User.create({
                          'email': 'user@eventi.xxx',
                          'password': 'user',
                          'roles': ['user']
                        }, () => {
                          chai.request(app)
                            .post('/auth/local')
                            .set('Accept', 'application/json')
                            .send({
                              'email': 'user@eventi.xxx',
                              'password': 'user'
                            })
                            .end((err, res) => {
                              userToken = res.body.token;
                              done();
                            });
                        });
                    });
            });

        });
    });

    after((done) => {
            User.remove(null, () => {
                this.server.close(function () {
                });
                done();
            });
    });

    it('registered the events service', () => {
        assert.ok(app.service('events'));
    });

    it('admin could create an event', (done) => {
       chai.request(app)
            .post('/events')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer '.concat(adminToken))
            .send({
                title: 'Event One',
                price: 100,
                city: 'Katowice',
                description: 'Event description.'
            })
            .end((err, res) => {
                res.body.should.have.property('title');
                res.body.title.should.equal('Event One');
                res.body.should.have.property('price');
                res.body.price.should.equal(100);
                res.body.should.have.property('city');
                res.body.city.should.equal('Katowice');
                res.body.should.have.property('description');
                res.body.description.should.equal('Event description.');
                res.body.should.have.property('_id');
                eventId = res.body._id;
                done();
            });
    });

    it('user cant create an event', (done) => {
      chai.request(app)
        .post('/events')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer '.concat(userToken))
        .send({
          title: 'Event One',
          price: 100,
          city: 'Katowice',
          description: 'Event description.'
        })
        .end((err, res) => {
          res.statusCode.should.equal(403);
          done();
        });
    });

    it('user cant delete an event', (done) => {
      chai.request(app)
        .delete('/events/' + eventId)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer '.concat(userToken))
        .send()
        .end((err, res) => {
          res.statusCode.should.equal(403);
          done();
        });
    });

    it('user cant list events', (done) => {
      chai.request(app)
        .get('/events')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer '.concat(userToken))
        .send()
        .end((err, res) => {
          res.statusCode.should.equal(403);
          done();
        });
    });

    it('everyone could show an event details', (done) => {
      chai.request(app)
        .get('/events/' + eventId)
        .send()
        .end((err, res) => {
          res.statusCode.should.equal(200);
          done();
        });
    });

    it('admin could update an event', () => {
      chai.request(app)
        .put('/events/' + eventId)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer '.concat(adminToken))
        .send({
            title: 'Event with changed title.'
          }
        )
        .end(function(err, res) {
          res.body.should.have.property('title');
          res.body.title.should.equal('Event with changed title.');
        });
    });

    it('admin could delete an event', () => {
      chai.request(app)
        .delete('/events/' + eventId)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer '.concat(adminToken))
        .end(function(err, res) {
          res.body.title.should.be.a('string');
          res.body.title.should.equal('Event with changed title.');
        });
    });

});
