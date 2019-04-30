/**
 * API mock
 * 
 */

import * as _ from 'lodash';

import API from './api';
const sinon = require('sinon');
const request = require('request-promise');

export default class APIMock extends API {

  constructor(...args) {
    //@ts-ignore
    super(...args);

    _.forEach(['get', 'head', 'post', 'put', 'patch', 'del', 'delete'], (method) => {
      // proxy before request
      this[method] = (...args) => request[method](args);
    });

    sinon.stub(this, 'check').resolves(true);
    sinon.stub(this, 'route').returns('');
  }

  restore() {
    //@ts-ignore
    this.check.resetHistory();
    //@ts-ignore
    this.route.resetHistory();
  }
}
