/**
 * Centralized connection for all rabbit channels
 * 2.0.3
 * params: {
 *  uri: String
 *  options: Object
 * }
 */

import amqp from 'amqplib';
import Promise from 'bluebird';
import _ from 'lodash';

export default class AmqpConnection {
  constructor(params, logger) {
    this.params = params || {};

    if (!this.params.uri) {
      throw new Error('[MQ - connection] An uri is required to connect to MQ');
    }

    this.logger = logger;
    this.connection = null;
    this.isBlocked = false;
    this.isClosed = true; // connection was closed
    this.restartTimeout = 60000; // how long before trying to re establish connection
    this.waitingForConnection = {}; // each key will hold an array of resolve functions
    this.connecting = false; // already trying to establish new connection ?
    this.timeout = null;
  }

  /*
  ** Check that connection to rabbit server is working
  */
  check() {
    return amqp.connect(this.params.uri, this.params.options)
      .then((connection) => {
        this.logger.debug('[MQ - connectionCheck] OK');
        connection.close();
        return true;
      })
      .catch((err) => {
        this.logger.debug('[MQ - connectionCheck] Error while trying to connect', err);
        return false;
      })
    ;
  }

  /*
  ** Resolves all pending promises once connection is ready
  ** this.waitingForConnection = {
  **  'Consumer Worker': [resolve, resolve, ...]
  **  'Producer PubSub': [resolve, ...]
  **   ...
  ** }
  */
  resolveAll() {

    if (!_.size(this.waitingForConnection)) {
      this.logger.warn('No getConnection pending');
      return;
    }

    _.forEach(this.waitingForConnection, (allResolves, key) => {
      this.logger.verbose(`${key} will now resolve ${_.size(allResolves)} waiting connections`);

      _.map(allResolves, (resolve) => resolve(this.connection));
      this.waitingForConnection[key].length = 0;
    });
    this.logger.verbose('after', this.waitingForConnection);
  }

  /*
  ** Establish amqp connection and attach event handlers for:
  **   - error: force connection close
  **   - close: setTimeout for restart in this.restartTimeout
  **   - blocked: just logs for now
  **   - unblocked: just logs for now
  */
  start() {
    this.connecting = true;

    if (!_.isNull(this.timeout)) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    return amqp.connect(this.params.uri, this.params.options)
      .then((connection) => {
        this.logger.info(`[MQ - connection] Connected to MQ server ${this.params.uri}`);
        this.connection = connection;
        this.connecting = false;

        // resolve all request for connection
        this.resolveAll();

        this.connection.on('close', (err) => {
          this.logger.error('[MQ - connection] The connection closed. Oooops..', err);
          this.connection = null;
          this.isClosed = true;

          this.logger.verbose('Will attempt restart in ', this.restartTimeout);
          this.timeout = setTimeout(() => {
            this.start();
          }, this.restartTimeout);
        });

        this.connection.on('error', (err) => {
          this.logger.error('[MQ - connection] The connection errored, please help us all:', err);
          this.connection.close();
        });

        this.connection.on('blocked', () => {
          this.logger.warn('[MQ - connection] The connection is busy, please wait and check your disk usage');
          // if this happens, you probably ran out of disk space...
          this.isBlocked = true;
        });

        this.connection.on('unblocked', () => {
          this.logger.warn('[MQ - connection] The connection is no more busy, thank you for your patience');
          this.isBlocked = false;
          // resolve all request for connection
          this.resolveAll();
        });

      })
      .catch((err) => {
        this.logger.error(`[MQ - connection] Something horrifying happened during the connection: ${err.message}`, err);
        this.connection = null;
        this.isClosed = true;
        this.isBlocked = false;

        if (!_.isNull(this.timeout)) {
          return Promise.resolve();
        }

        this.timeout = setTimeout(() => {
          return this.start();
        }, this.restartTimeout);
      });
  }

  /*
  ** close connection (useful for tests)
  */
  stop() {
    if (!this.connection) {
      return Promise.resolve('connection is Null');
    }
    return this.connection.close()
      .then(() => {
        if (!_.isNull(this.timeout)) {
          clearTimeout(this.timeout);
          this.timeout = null;
        }
        this.connection = null;
        return 'connection has been closed';
      })
    ;
  }

  /*
  ** name: String  Identifier of mq wishing to create a channel.
  ** Resolves connection if it's ready or store resolve for later consumption.
  */
  getConnection(name) {
    if (!_.isString(name)) {
      throw new Error('[MQ - connection] A name is required to get connection');
    }

    if (this.connection && !this.isBlocked) {
      this.logger.debug(`[MQ - connection] Resolving connection for ${name}`);
      return Promise.resolve(this.connection);
    }

    this.logger.debug('No connection ready, waiting to resolve...');
    this.waitingForConnection[name] = this.waitingForConnection[name] || [];

    return new Promise((resolve) => {

      this.waitingForConnection[name].push(resolve);
      this.logger.verbose(`MQ ${name} has now ${_.size(this.waitingForConnection[name])} items waiting for connection`);

      // If the connection isBlocked it means it exits so we do not need to start again
      // pending request will be resolved on unblocked event.
      if (!this.isBlocked && !this.connecting) {
        this.logger.info('Starting connection !');
        return this.start();
      }

    });
  }
}
