
const path = require('path');
const NeDB = require('nedb');
const service = require('feathers-nedb');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  const db = new NeDB({
    filename: path.join(app.get('nedb'), 'registrations.db'),
    autoload: true
  });

  let options = {
    Model: db,
    paginate: {
      default: 5,
      max: 25
    }
  };

  app.use('/registrations/confirm', {
    create: function(data, params, callback) {
      //todo check ip address
      return Promise.resolve('TRUE');
    }
  });

  app.use('/registrations', service(options));

  const registrationService = app.service('/registrations');

  let config = app.get('auth');

  registrationService.before(hooks.before);
  registrationService.after(hooks.after);
};
