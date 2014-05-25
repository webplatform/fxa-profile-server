/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const db = require('../db');

module.exports = {
  auth: {
    strategy: 'oauth',
    scope: ['profile']
  },
  handler: function profile(req, reply) {
    var obj = {};
    obj.email = req.auth.credentials.email;
    obj.uid   = req.auth.credentials.user;

    db.getMediawikiProfile(obj.email)
      .done(function(a) {
        if(!!a.fullName) {
          obj.fullName = a.fullName;
        }
        if(!!a.username) {
          obj.username = a.username;
        }
        reply(obj);
      }, reply);
  }
};


