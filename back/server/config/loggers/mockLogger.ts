/**
 * Mock Logger
 * 1.1.0
 */

import * as _ from 'lodash';

export default function MockLogger() {
  this.log = _.noop;
  this.error = _.noop;
  this.warn = _.noop;
  this.info = _.noop;
  this.verbose = _.noop;
  this.debug = _.noop;
  this.silly = _.noop;
}
