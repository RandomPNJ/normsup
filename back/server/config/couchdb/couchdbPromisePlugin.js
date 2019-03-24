/**
 * couchDBPromisePlugin
 * 2.0.0
 */

import Promise from 'bluebird';
import requestLib from 'request';
import _ from 'lodash';
const request = requestLib.defaults({jar: false});

module.exports = (req) => {
  return new Promise((resolve, reject) => {
    request(req, (err, response, body) => {
      if (body) {
        try {
          body = JSON.parse(body);
        } catch (err) {
          // no error in no parsing
        }
      }

      const statusCode = _.get(response, 'statusCode', 500);
      if (statusCode >= 200 && statusCode < 400) {
        return resolve(body);
      }

      if (_.isObject(body)) {
        body.statusCode = statusCode;
      }

      const error = err || body;
      const errorObj = _.isError(error) ? error : new Error(error.message || error.error || response);
      errorObj.metadata = error;
      reject(errorObj);
    });
  });
};
