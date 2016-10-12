'use strict';
const registration = require('./registration');
const event = require('./event');
const authentication = require('./authentication');
const user = require('./user');

module.exports = function() {
  const app = this;
  
  app.configure(authentication);
  app.configure(user);
  app.configure(event);
  app.configure(registration);
};
