/**
 * API
 * 1.3.0
 */

import request from 'request-promise';
import _ from 'lodash';
import Promise from 'bluebird';

export default class API {
  constructor(apiName, apiConfig, app, logger) {
    this.config = apiConfig;
    this.name = apiName;
    this.app = app;
    this.logger = logger;

    _.forEach(['get', 'head', 'post', 'put', 'patch', 'del', 'delete'], (method) => {
      // proxy before request to integrate isUp and set service as down if down
      this[method] = (...args) => {
        return this.app.isUpAndRunning([this.name])
          .then(() => request[method](...args).promise()) // request-promise overlay on bluebird promises
          .catch((err) => {
            // Bad Gateway, Service Unavailable: Requested route ('XXX') does not exist.
            if (err.code === 'ENOTFOUND' || _.includes([502, 503, 504], err.statusCode)) {
              this.app.getService(this.name).setDown();
            }
            return Promise.reject(err);
          })
        ;
      };
    });

    _.bindAll(this);
  }

  check() {
    let statusRoute;
    try {
      statusRoute = this.route('status');
    } catch (e) {
      if (e.code === 'NO_ROUTE') {
        this.logger.debug(`${this.name} has no status route`);
        return Promise.resolve(true);
      }
      throw e;
    }

    return this.get({
      url: statusRoute,
      qs: {
        noDeps: true,
      },
    })
      .tap(() => this.logger.debug(`${this.name} is up`))
      .tapCatch(() => this.logger.debug(`${this.name} is down`))
    ;
  }

  route(routeName, params = {}) {
    const route = _.get(this.config, ['routes', routeName]);
    if (_.isUndefined(route)) {
      const error = new Error(`No route ${routeName} defined in api ${this.name}`);
      error.code = 'NO_ROUTE';
      throw error;
    }

    return this.config.url + (_.isFunction(route) ? route(params) : route);
  }
}
