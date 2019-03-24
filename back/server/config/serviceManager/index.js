/**
 * ServiceManager
 * 1.3.0
 */

import _ from 'lodash';
import Promise from 'bluebird';
import Joi from 'joi';

import Service from './service';

/**
 * Options:
 * retryUpAndRunning: how many times retrying before reject. -1 seems unlimited
 * upCheck: time before two checks (in ms)
 * logger: logger used by ServiceManager
 * timeout: time before a health check is considered as down (in ms). -1 seems unlimited
 * noCheck: toggle up check or not
 */
const OptionsSchema = Joi.object().keys({
  retryUpAndRunning: Joi.number().min(-1).optional(),
  upCheck: Joi.number().min(0).optional(),
  logger: Joi.object().optional(),
  timeout: Joi.number().min(-1).optional(),
  noCheck: Joi.boolean().optional(),
});

const defaults = {
  upCheck: 10 * 60 * 1000,
  retryUpAndRunning: 5,
  timeout: -1,
  noCheck: false,
};

export default class ServiceManager {
  constructor(options = {}) {
    Joi.assert(options, OptionsSchema);
    this.options = _.defaults(options, defaults);
    this.services = {};
    this.onLoad = [];
    this.private = [];

    // binding is necessary if extending class (eg: ServiceManagerMock)
    // or we could use super everytime we extend..
    // we could use _.bindAll(this) but fn would not be logged
    // for an extended class
    _.bindAll(this, [
      'get',
      'getService',
      'getAll',
      'has',
      'set',
      'unset',
      'isUpAndRunning',
      'waitForUpAndRunning',
      'setOptions',
    ]);
  }

   /**
    * Returns a registered service (ie an API, a Connector, etc..)
    * asStatic: if true, returns service, if false return promise of service
    * noCheck: if true, disable service status checkup
    * @returns Promise or *
    */
  get(name, options = {}) {
    _.defaults(options, {
      asStatic: true,
      noCheck: this.options.noCheck,
    });
    Joi.assert(options, Joi.object().keys({
      asStatic: Joi.boolean().required(),
      noCheck: Joi.boolean().required(),
    }));

    const service = _.get(this.services, name);
    if (!service) {
      const error = new Error(`[ServiceManager] No service ${name} found`);
      error.statusCode = 404;
      if (options.asStatic) {
        throw error;
      }

      return Promise.reject(error);
    }

    if (options.asStatic) {
      if (service.isUp() || options.noCheck) {
        return service.service;
      }

      const error = new Error(`Service ${name} unavailable`);
      error.statusCode = 503;
      throw error;
    }

    return service.getService(options.noCheck);
  }

  getService(name) {
    const service = _.get(this.services, name);
    if (!service) {
      const error = new Error(`[ServiceManager] No service ${name} found`);
      error.statusCode = 404;
      throw error;
    }

    return service;
  }

  /**
   * Get all registered public services names
   * @returns [string]
   */
  getAll() {
    return _.map(_.filter(this.services, (service, serviceName) => {
      return service.name === serviceName && !_.includes(this.private, serviceName);
    }), 'name');
  }
  /**
   * Check if a service is already registered
   * @returns [boolean]
   */
  has(name) {
    return !!_.get(this.services, name);
  }
  /**
   * Register a service, as public or private, with optional aliases
   * name: [string] This is what the service is registered as
   * value: [Object] The service to register
   * options: [Object] Options when registering a service, refer to the schema above
   *    aliases: [array] Names the service can be called with
   *    onLoad: if true, load the service when on server start
   *    private: if true, service does not show when retrieving all services
   *    noCheck: if true, disable service status checkup
   * @returns Promise or boolean
   */
  set(name, value, options = {}) {
    if (!_.isString(name)) {
      const error = new Error('[ServiceManager] A name is required and should be a string');
      error.statusCode = 400;
      throw error;
    }

    if (this.has(name)) {
      const error = new Error(`[ServiceManager] Service ${name} already exist`);
      error.statusCode = 400;
      throw error;
    }

    const aliases = options.aliases || [];

    const service = new Service(name, value, _.omit(options, ['aliases']));

    _.set(this.services, name, service);
    service.setAliases(_.reduce(aliases, (acc, alias) => {
      if (this.has(alias)) {
        return acc;
      }
      _.set(this.services, alias, service);
      acc.push(alias);
      return acc;
    }, []));

    if (options.onLoad) {
      this.onLoad.push(name);
    }

    if (options.private) {
      this.private.push(name);
    }

    return !this.options.noCheck ? service.check().catch(_.noop) : Promise.resolve(true);
  }

  /**
   * Unset a service if he was registered
   * @rejects if service cannot be found
   * @returns {void}
   */
  unset(name) {
    if (!this.has(name)) {
      const error = new Error(`[ServiceManager] No service ${name} found`);
      error.statusCode = 404;
      throw error;
    }

    const service = _.get(this.services, name);

    if (service.name !== name) {
      const error = new Error(`[ServiceManager] No alias can be unset, alias ${name} for ${service.name}`);
      error.statusCode = 400;
      throw error;
    }

    if (service.options.onLoad) {
      _.pull(this.onLoad, name);
    }

    if (service.options.private) {
      _.pull(this.private, name);
    }

    _.forEach(service.aliases, alias => _.unset(this.services, alias));
    _.unset(this.services, name);
  }

  /**
   * Checks if given services are up
   * if no given services, checks if onLoad services are up
   * @resolves true
   * @rejects if any service is down
   * @returns [boolean]
   */
  isUpAndRunning(services = []) {
    if (this.options.noCheck) {
      return Promise.resolve(true);
    }

    return Promise.map(
      _.size(services) ? services : this.onLoad,
      name => this.has(name) ? this.getService(name).check() : false
    )
      .return(true)
    ;
  }

  /**
   * Wait for given services to be up
   * if no given services, wait for onLoad services
   * @resolves true
   * @rejects after retry limit is reached
   * @returns {void}
   */
  waitForUpAndRunning(services = [], params = {}, _index = 0) {
    const localParams = _.merge({}, this.options, params);
    this._log('verbose', '[ServiceManager] waitForUpAndRunning', {
      services: _.size(services) ? services : this.onLoad,
      _index,
      retry: localParams.retryUpAndRunning,
    });
    return this.isUpAndRunning(services)
      .catch((err) => {
        if (localParams.retryUpAndRunning <= 0 && _index >= localParams.retryUpAndRunning) {
          return Promise.reject(err);
        }

        this._log('warn', `[ServiceManager] waitForUpAndRunning failed due to: ${err.message}`, err);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(this.waitForUpAndRunning(services, params, _index + 1));
          }, localParams.upCheck);
        });
      })
    ;
  }

  /**
   * Changes a service's options
   * @returns {void}
   */
  setOptions(options = {}) {
    Joi.assert(options, OptionsSchema);
    this.options = _.defaults(options, this.options, defaults);
  }

  _log(...args) {
    if (!this.options.logger) {
      return;
    }

    this.options.logger.log(...args);
  }
}
