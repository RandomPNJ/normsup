/**
 * AdminCache
 * 0.1.0
 */

import Promise from 'bluebird';
import _ from 'lodash';

import RamDBRepository from '../ramdb/ramdbRepository';

export default class AdminCache extends RamDBRepository {
  constructor(...args) {
    super(...args);
    this._started = false;
    this.bulkInit = false;

    _.bindAll(this);
  }

  setAPI(apiService, bulkInit, method, route) {
    this.api = apiService;
    this.method = method;
    this.route = route;
    this.bulkInit = !_.isUndefined(bulkInit) ? bulkInit : true;
  }

  start(params, queryConfig = {}) {
    if (!this.bulkInit) {
      this._started = true;
      return Promise.resolve();
    }

    return this._query(null, params, queryConfig)
      .then((allRes) => {
        if (!_.isArray(allRes)) {
          return Promise.reject(new Error('An array is required while bulk initializing'));
        }

        return _.map(allRes, res => this._dataWrapper(res._id, res));
      })
      .then(res => super.upsert(res))
      .tap(() => {
        this._started = true;
      })
      .catch(err => {
        err.code = 'NOT_FOUND';
        return Promise.reject(err);
      })
    ;
  }

  check() {
    return Promise.resolve(this._started);
  }

  // proxy repository
  get(id, params, queryConfig = {}) {
    if (this.bulkInit) {
      return super.get(id)
        .then((res) => {
          return this._dataWrap ? res.data : res;
        })
      ;
    }

    return super.get(id)
      .catch((err) => {
        if (err.code !== 'NOT_FOUND') {
          return Promise.reject(err);
        }

        return this._query(id, params, queryConfig)
          .then(res => this._dataWrapper(id, res))
          .then(res => super.upsert(res))
          .catch(err => {
            err.code = 'NOT_FOUND';
            return Promise.reject(err);
          })
        ;
      })
      .then((res) => {
        return this._dataWrap ? res.data : res;
      })
    ;
  }

  _query(id, params, queryConfig) {
    loggerT.debug(`Querying ${this.method.toUpperCase()} ${this.api.route(this.route, params)}`);
    return this.api[this.method]({
      url: this.api.route(this.route, params),
      qs: queryConfig.qs ? params : undefined,
      body: queryConfig.body ? params : undefined,
      json: queryConfig.json,
    })
      .then((res) => {
        // some APIs are not JSON ones
        try {
          return !queryConfig.json ? JSON.parse(res) : res;
        } catch (e) {
          return res;
        }
      })
    ;
  }

  _dataWrapper(id, data) {
    loggerT.debug(`Wrapping ${this.name} ${id}`);
    if (!_.isObject(data)) {
      this._dataWrap = true;
      return {
        _id: id,
        data,
      };
    }

    this._dataWrap = false;
    data._id = id;
    delete data.id;
    return data;
  }

  request(...args) {
    return super.request(...args);
  }

  find(...args) {
    return super.find(...args);
  }

  findOne(...args) {
    return super.findOne(...args);
  }
}
