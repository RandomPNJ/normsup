/**
 * API mock
 * 1.0.0
 */

import request from 'request-promise';
import _ from 'lodash';

import API from './api';

export default class APIMock extends API {
  constructor(...args) {
    super(...args);

    _.forEach(['get', 'head', 'post', 'put', 'patch', 'del', 'delete'], (method) => {
      // proxy before request
      this[method] = (...args) => request[method](args);
    });

    sinon.stub(this, 'check').resolves(true);
    sinon.stub(this, 'route').returns('');
  }

  restore() {
    this.check.resetHistory();
    this.route.resetHistory();
  }
}
