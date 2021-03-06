
import Tpay from '../../../classes/tpay';
import Client from '../../../classes/client';

const auth = require('feathers-authentication').hooks;

const updatePayment = function(options = {}) {

  return function(hook) {

    const Event = hook.app.service('events');
    return Event.get(hook.data.eventId)
      .then(event => {

        const options = {
          merchantId: hook.app.get('merchantId'),
          merchantCode: hook.app.get('merchantCode'),
          price: event.price,
          description: event.title
        };

        const tpay = new Tpay(
          options,
          new Client(
            hook.data.firstName,
            hook.data.lastName,
            hook.data.email
          )
        );

        hook.data.paymentLink = tpay.generateQueryString(
          '/registration/response/success',
          '/registration/response/failure'
        );
        hook.data.confirmed = false;
        hook.data.crc = tpay.crc;

      });
  };
};

exports.before = {
  all: [],
  find: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    auth.restrictToRoles({
      roles: ['admin']
    })
  ],
  get: [
  ],
  create: [
      updatePayment()
  ],
  update: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    auth.restrictToRoles({
      roles: ['admin']
    })
  ],
  patch: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    auth.restrictToRoles({
      roles: ['admin']
    })
  ],
  remove: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    auth.restrictToRoles({
      roles: ['admin']
    })
  ]
};

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [

  ],
  update: [],
  patch: [],
  remove: []
};
