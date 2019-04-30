/**
 * Service
 * 1.1.0
 */

import * as _ from 'lodash';
import {Promise} from 'bluebird';
import * as Joi from 'joi';

const defaults = {
  timeout: -1,
};

const OptionsSchema = Joi.object().keys({
  onLoad: Joi.boolean().optional(),
  private: Joi.boolean().optional(),
  timeout: Joi.number().min(-1).required(),
});

export default class Service {

  name: any;
  service: any;
  options: any;
  aliases: any;
  status: any;
  pendingCheck: any;

  constructor(name, service, options = {}) {
    _.defaults(options, defaults);
    if (!_.isString(name)) {
      throw new Error('No name provided');
    }

    if (!service) {
      throw new Error('No service provided');
    }

    Joi.assert(options, OptionsSchema);

    this.name = name;
    this.service = service;
    this.options = options;

    this.aliases = [];
    this.status = !this.hasCheck();
    this.pendingCheck = null;
  }

  setAliases(aliases = []) {
    this.aliases = aliases;
  }

  isUp() {
    return this.status;
  }

  setUp() {
    this.status = true;
  }

  setDown() {
    this.status = false;
  }

  hasCheck() {
    return _.isFunction(this.service.check) || _.isFunction(this.options.check);
  }

  check() {
    if (this.pendingCheck) {
      return this.pendingCheck;
    }

    let promise;
    if (this.service.check) {
      promise = Promise.method(this.service.check).call(this.service);
    }

    if (!promise && this.options.check) {
      promise = Promise.method(this.options.check).call(this.service);
    }

    if (!promise) {
      promise = Promise.resolve(true);
    }

    this.pendingCheck = promise;

    if (this.options.timeout > 0) {
      promise.timeout(this.options.timeout);
    }

    const error = new Error(`Service ${this.name} unavailable`);
    error['statusCode'] = 503;

    return promise
      .then((bool) => {
        if (_.isBoolean(bool) && !bool) {
          this.setDown();
          return Promise.reject(error);
        }

        this.setUp();
        return true;
      })
      .catch(() => {
        this.setDown();
        return Promise.reject(error);
      })
      .finally(() => {
        this.pendingCheck = null;
      })
    ;
  }

  getService(noCheck = false) {
    if (this.isUp() || noCheck) {
      return Promise.resolve(this.service);
    }

    return this.check()
      .then(() => this.service)
    ;
  }
}
