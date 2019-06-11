/**
 * Version readVersion
 * 1.2.0
 */

import * as _ from 'lodash';
import {Promise} from 'bluebird';
import * as fs from 'fs';

// BEWARE this file path is important!
const pjson = require('../../../package.json');
const readFileAsync = Promise.promisify(fs.readFile, {multiArgs: true});

/**
 * Try to get version from git.version file (generated by bluid script)
 * defaults to package.json version
 */
export function readVersion() {
  // @ts-ignore
  return readFileAsync('git.version', 'utf8')
    .catch((err) => {
      if (err.code === 'ENOENT') {
        const error = new Error(`Could not read version from git.version: ${err.message}`);
        error['code'] = 'ENOENT';
        return Promise.reject(error);
      }

      return Promise.reject(err);
    })
    .then((data) => {
      const tab = _.compact(_.split(data, '\n'));
      if (_.size(tab) !== 4) {
        return Promise.reject(new Error('Could not extract version from git.version, format has changed'));
      }

      return _.trimStart(_.trim(tab[1]), 'v');
    })
  ;
}

export function getAppVersion(config) {
  const loggerT = global['loggerT'];

  return readVersion()
    .then(version => {
      config.appVersion = version;
    })
    .catch(err => {
      if (err.code === 'ENOENT') {
        loggerT.warn('Falling back to package.json version');
        config.appVersion = pjson.version;
        return;
      }

      return Promise.reject(err);
    })
  ;
}