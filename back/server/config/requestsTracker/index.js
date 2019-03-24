/**
 * RequestsTracker
 * 0.0.1
 */

import uuid from 'uuid';
import _ from 'lodash';
import config from '../environment';

export class RequestsTracker {
  constructor(config) {

    this.config = config || {};

    if (!this.config.logger && !(console && console.info && console.warn && console.error)) { // eslint-disable-line no-console
      throw new Error('Error: no logger provided and no console available');
    }

    this.logger = this.config.logger ? this.config.logger : console; // eslint-disable-line no-console
    this.concurrent = this.config.concurrent || 0;
    this.maxConcurrency = this.config.maxConcurrency || 4;
    this.intervalDuration = 10000;
    this.verbose = this.config.verbose !== undefined || !!this.config.verbose;
    this.autorun = this.config.autorun === undefined || !!this.config.autorun;
    this.autorun = this.config.logPrefix || '';

    this.firstRun = true;
    this.registry = {};
    this.logPrefix = '';

    if (!this.verbose) {
      _.each(this.logger, (item, key) => {
        if (_.isFunction(item)) {
          this.logger[key] = _.noop;
        }
      });
    } else {
      this.createPrefix();
    }

    if (this.autorun) {
      this.startCron();
    }
  }

  createPrefix() {
    let vcapApplication;

    try {
      vcapApplication = JSON.parse(process.env.VCAP_APPLICATION);
    } catch (e) {
      this.logger.warn('no vcapApplication');
    } finally {
      this.logPrefix = vcapApplication !== undefined ?
        `[${vcapApplication.application_name}-${vcapApplication.instance_index}]` :
        `[${config.appName}-local]`
      ;
    }

    _.each(this.logger, (item, key) => {
      if (_.isFunction(item)) {
        this.logger[key] = _.partial(this.logger[key], this.logPrefix);
      }
    });

  }

  startCron() {

    if (this.stopInterval) {
      this.logger.warn('removing previous interval');
      clearInterval(this.stopInterval);
      this.stopInterval = null;
    }

    this.printAndClean();
    this.stopInterval = setInterval(() => {
      this.printAndClean();
    }, this.intervalDuration);

  }

  printAndClean() {

    if (this.firstRun) {
      this.firstRun = false;
      this.logger.info('Requests tracker initialized.');
      return;
    }

    const toLog = _.reduce(this.registry, (acc, value, key) => {
      acc[key] = value;
      if (value.end) {
        delete this.registry[key];
      }
      return acc;
    }, {});

    if (!_.size(toLog)) {
      this.logger.info(`No requests in the last ${this.intervalDuration}ms`);
      return;
    }
    this.logger.info(toLog);
  }

  format(id, url) {
    if (!this.registry[id]) {
      this.registry[id] = {
        app: this.logPrefix,
        start: Date.now(),
      };

      if (url) {
        this.registry[id].url = url;
      }

      return;
    }

    const end = Date.now();
    const duration = end - this.registry[id].start;

    this.registry[id].end = end;
    this.registry[id].duration = duration;

    if (this.verbose) {
      this.logger.info(id, this.registry[id]);
    }

  }

  trackRequests(options = {}) {
    options.uuidVersion = options.uuidVersion || 'v4';
    options.setHeader = options.setHeader === undefined || !!options.setHeader;  // default to true
    options.headerName = options.headerName || 'X-Request-Id';
    options.attributeName = options.attributeName || 'id';

    return (req, res, next) => {

      if ((req.originalUrl.substr(0, 5) !== '/api/') && !req.header(options.headerName)) {
        return next();
      }

      this.logger.info('baseUrl', req.originalUrl);

      this.concurrent++;
      const id = req.header(options.headerName) || uuid[options.uuidVersion]();

      this.format(id, req.originalUrl);
      req[options.attributeName] = id;

      if (options.setHeader) {
        res.setHeader(options.headerName, req[options.attributeName]);
      }

      res.on('finish', () => {
        this.concurrent--;
        this.format(id);
      });

      next();
    };
  }
}
