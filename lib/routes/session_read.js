/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const db = require('../db');
const logger = require('../logging').getLogger('fxa.db.mysql');

module.exports = {
  auth: {
    strategy: 'oauth',
    scope: ['session']
  },
  handler: function sessionRead(req, reply) {
    var obj = {};
    obj.uid   = req.auth.credentials.user;

    logger.verbose('sessionRead for uid ', obj.uid);

    db.getSessionData(obj.uid)
      .then( function (row) {

        obj.email = row.email;
        obj.fullName = row.fullName;
        obj.username = row.username;

        return obj;
      })
      .done( function (a) {
        reply(a);
      }, reply);
  }
};
