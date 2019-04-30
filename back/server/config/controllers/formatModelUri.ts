/**
 * formatModelUri
 * 1.0.1
 */

import * as _ from 'lodash';

/**
 * Filter model URI to managed different format of /
 */
export default (modelUri) => {
  if (!_.isString(modelUri)) {
    throw new Error('Model URI must be a string');
  }

  const trimmed = _.trim(modelUri);
  const start = _.startsWith(trimmed, '/') ? trimmed : '/' + trimmed;
  const end = _.endsWith(start, '/') ? start.substr(0, start.length - 1) : start;

  return end;
};
