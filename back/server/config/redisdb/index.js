/**
 * Redis
 * 1.0.0
 */

import redis from 'redis'; // https://github.com/NodeRedis/node_redis
import Promise from 'bluebird';

import redisRepository from './redisRepository';

export default class RedisDB {
  constructor(params, logger) {
    this.logger = logger;
    this.params = params || {};
    this.params.maxConnectTime = this.params.maxConnectTime || 5 * 1000;

    if (!this.params.uri) {
      throw new Error('No URI found for RedisDB');
    }

    if (!this.logger) {
      throw new Error('No logger found for RedisDB');
    }

    this.ready = null;

    // Promisify redis lib
    Promise.promisifyAll(redis.RedisClient.prototype);
    Promise.promisifyAll(redis.Multi.prototype);

    this.logger.info(`[DB] Connexion au serveur redis ${this.params.uri}.`);
    this.redisClient = redis.createClient({
      url: this.params.uri,
    });

    this.repository = redisRepository;
    this.repositoryData = {
      redisClient: this.redisClient,
      logger: this.logger,
    };
  }

  start() {
    return new Promise((resolve, reject) => {
      this.clientEvents(resolve, reject);
    });
  }

  clientEvents(resolve, reject) {
    if (!this.redisClient) {
      return reject(new Error('[DB] Cannot add event listenners, RedisDB Client is undefined.'));
    }

    const stop = setTimeout(() => {
      const error = `Redis did not connect in less than ${this.params.maxConnectTime}ms`;
      return reject(error);
    }, this.params.maxConnectTime);

    this.redisClient.on('error', (err) => {
      this.logger.error('[DB] RedisDB Client error event:', err);
    });

    this.redisClient.on('ready', (ready) => {
      this.ready = true;
      this.logger.info('[DB] RedisDB Client ready event.', ready);
      clearTimeout(stop);
      return resolve();
    });

    this.redisClient.on('connect', (connect) => {
      this.logger.info('[DB] RedisDB Client connect event.', connect);
    });

    this.redisClient.on('reconnecting', (reconnecting) => {
      this.logger.warn('[DB] RedisDB Client reconnecting event.', reconnecting);
    });

    this.redisClient.on('warning', (warning) => {
      this.logger.info('[DB] RedisDB Client warning event.', warning);
    });

    this.redisClient.on('end', (end) => {
      this.ready = false;
      this.logger.info('[DB] RedisDB Client end event.', end);
    });

  }

  check() {
    return Boolean(this.ready);
  }
}
