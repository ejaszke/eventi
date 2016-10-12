
import path from 'path';
import NeDB from 'nedb';
import service from 'feathers-nedb';
import hooks from './hooks';
import winston from 'winston';

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

  app.use('/registrations', service(options));

  const registrationService = app.service('/registrations');

  registrationService.before(hooks.before);
  registrationService.after(hooks.after);

  app.post('/registrations/confirm', function (req, res) {
    /* jshint camelcase: false */
    winston.info('Tpay confirmation received crc: ' + req.body.tr_crc + ' status:' + req.body.tr_status );

    if (app.get('env') !== 'development') {
      if (!app.get('tpayIP').includes(req.ip)) {
        res.json('FALSE');
      }
    }

    /* jshint camelcase: false */
    if (req.body.tr_status === true) {
      registrationService.patch(null, {'confirmed': true}, {query: {crc: req.body.tr_crc}});
    }

    res.json('TRUE');
  });



};
