/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const db = require('../db');
const logger = require('../logging').getLogger('fxa.db.mysql');

const TOKEN_REGEX = /^[A-Fa-f0-9]{64}$/;

module.exports = {
  handler: function sessionRecover(req, reply) {
    var authorization = req.headers['authorization'] || false;

    // Expected format 'Authorization: Token [a-fA-F0-1]{64}', but we dont check the word token
    var sessionToken = (authorization !== false)? authorization.split(" ")[1]:false;

    if ( sessionToken === false || TOKEN_REGEX.test(sessionToken) === false ) {
      var reason = 'Required Authorization header with Token are either not found is in an invalid format';
      logger.info('sessonRecover attempt failed', reason);

      reply({
        "code": 401,
        "message": "Unauthorized",
        "reason": reason
      })
      .code(401);

      return;
    }


    logger.info('sessonRecover from token', sessionToken);

    db.getSessionRecover(sessionToken)
      .done( function (row) {
        if ( ! row['uid'] ) {
            logger.info('sessonRecover, no session found with token', sessionToken);
            reply({
              "code": 410,
              "message": "Gone",
              "reason": "No session found"
            })
            .code(410);

            return;
        }

        reply(row);
      }, reply);
  }

};
