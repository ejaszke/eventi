
import Tpay from '../../../classes/tpay';
import Client from '../../../classes/client';

const auth = require('feathers-authentication').hooks;

const updatePayment = function(options = {}) {

  return function(hook) {
    const options = {
      merchantId: hook.app.get('merchantId'),
      merchantCode: hook.app.get('merchantCode')
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
      100,
      '/registration/response/success',
      '/registration/response/failure'
    );
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
