/**
 * redisRepository
 * 1.2.1
 * https://www.cheatography.com/tasjaevan/cheat-sheets/redis/pdf/
 * https://github.com/NodeRedis/node_redis
 * https://redis.io/topics/data-types
 */
import Promise from 'bluebird';
import _ from 'lodash';

/**
 * Wrapper for redis operations.
 * All operations are promises.
 */
export default class Repository {
  constructor(params, db, data) {
    this.params = params || {};
    this.name = this.params.name;
    this.db = _.get(data, 'redisClient');
    this.logger = _.get(data, 'logger');
  }

  /**
   * Internal helper to parse res as JSON.
   */
  _parseRes(res) {
    if (!res || _.isEmpty(res)) {
      const error = new Error('[REDIS][_parseRes] Empty result');
      error.code = 'NOT_FOUND';
      throw error;
    }

    try {
      if (_.isArray(res)) {
        return _.map(res, transport => JSON.parse(transport));
      }

      return JSON.parse(res);
    } catch (e) {
      const error = new Error(`[REDIS][_parseRes] Unable to parse res: ${e.message}`);
      throw error;
    }
  }

  /**
   * https://redis.io/commands/set
   * Set key to hold the string value.
   * If key already holds a value, it is overwritten, regardless of its type.
   * Any previous time to live associated with the key is discarded on successful
   * SET operation.
   */
  set(key, value) {
    if (_.isUndefined(key)) {
      const error = new Error('[REDIS][SET] A key is required to perform a set operation.', key, value);
      return Promise.reject(error);
    }

    if (_.isUndefined(value)) {
      const error = new Error('[REDIS][SET] A value is required to perform a set operation.', key, value);
      return Promise.reject(error);
    }

    const prefixedKey = `${this.name}:${key}`;
    return this.db.setAsync(prefixedKey, JSON.stringify(value))
      .tapCatch((err) => this.logger.error('[REDIS][SET]', err))
    ;
  }

  /**
   * https://redis.io/commands/mset
   * Sets the given keys to their respective values.
   * MSET replaces existing values with new values, just as regular SET.
   * See MSETNX if you don't want to overwrite existing values.
   * MSET is atomic, so all given keys are set at once.
   * It is not possible for clients to see that some of the keys were updated
   * while others are unchanged.
   */
  mset(keys, values) {
    if (_.isUndefined(keys) || !_.isArray(keys)) {
      const error = new Error('[REDIS][MSET] Keys needs to be an array.');
      return Promise.reject(error);
    }

    if (_.isUndefined(values)) {
      const error = new Error('[REDIS][MSET] Values needs to be an array.');
      return Promise.reject(error);
    }

    if (!_.size(keys) || _.size(keys) !== _.size(values)) {
      const error = new Error('[REDIS][MSET] Values and keys must have the same length and legnth must not be 0');
      return Promise.reject(error);
    }

    const op = [];
    _.each(keys, (key, index) => {
      const prefixedKey = `${this.name}:${key}`;
      op.push(prefixedKey);
      op.push(JSON.stringify(values[index]));
    });

    return this.db.msetAsync(...op)
      .tapCatch((err) => this.logger.error('[REDIS][MSET]', err))
    ;
  }

  /**
   * https://redis.io/commands/hset
   * Sets field in the hash stored at key to value.
   * If key does not exist, a new key holding a hash is created.
   * If field already exists in the hash, it is overwritten.
   */
  hset(hash, key, value) {
    if (_.isUndefined(hash)) {
      const error = new Error('[REDIS][HSET] A hash is required.', key, hash, value);
      return Promise.reject(error);
    }

    if (_.isUndefined(key)) {
      const error = new Error('[REDIS][HSET] A key is required.', key, hash, value);
      return Promise.reject(error);
    }

    if (_.isUndefined(value)) {
      const error = new Error('[REDIS][HSET] A value is required.', key, hash, value);
      return Promise.reject(error);
    }

    const prefixedHash = `${this.name}:${hash}`;
    return this.db.hsetAsync(prefixedHash, key, JSON.stringify(value))
      .tapCatch((err) => this.logger.error('[REDIS][HSET]', err))
    ;
  }

  /**
   * https://redis.io/commands/hmset
   * Sets the specified fields to their respective values in the hash stored at key.
   * This command overwrites any specified fields already existing in the hash.
   * If key does not exist, a new key holding a hash is created.
   */
  hmset(hash, keys, values) {
    if (_.isUndefined(hash)) {
      const error = new Error('[REDIS][HMSET] A hash is required.');
      return Promise.reject(error);
    }

    if (_.isUndefined(keys) || !_.isArray(keys)) {
      const error = new Error('[REDIS][HMSET] Keys needs to be an array.');
      return Promise.reject(error);
    }

    if (_.isUndefined(values)) {
      const error = new Error('[REDIS][HMSET] Values needs to be an array.');
      return Promise.reject(error);
    }

    if (!_.size(keys) || _.size(keys) !== _.size(values)) {
      const error = new Error('[REDIS][HMSET] Values and keys must have the same length and legnth must not be 0');
      return Promise.reject(error);
    }

    const op = [];
    _.each(keys, (key, index) => {
      op.push(key);
      op.push(JSON.stringify(values[index]));
    });

    const prefixedHash = `${this.name}:${hash}`;
    return this.db.hmsetAsync(prefixedHash, ...op)
      .tapCatch((err) => this.logger.error('[REDIS][HMSET]', err))
    ;
  }


  /**
   * https://redis.io/commands/get
   * Get the value of key.
   * If the key does not exist the special value nil is returned.
   * An error is returned if the value stored at key is not a string,
   * because GET only handles string values.
   */
  get(key, value) {
    if (_.isUndefined(key)) {
      const error = new Error('[REDIS][GET] A key is required.', key, value);
      return Promise.reject(error);
    }

    const prefixedKey = `${this.name}:${key}`;
    return this.db.getAsync(prefixedKey)
      .then(this._parseRes)
      .tapCatch((err) => err.code !== 'NOT_FOUND' && this.logger.error('[REDIS][GET]', err))
    ;
  }

  /**
   * https://redis.io/commands/mget
   * Returns the values of all specified keys.
   * For every key that does not hold a string value or does not exist,
   * the special value nil is returned.
   * Because of this, the operation never fails.
   */
  mget(keys) {
    if (_.isUndefined(keys) || !_.isArray(keys)) {
      const error = new Error('[REDIS][MGET] Keys needs to be an Array.', keys);
      return Promise.reject(error);
    }

    const prefixedKeys = _.map(keys, (key) => `${this.name}:${key}`);
    return this.db.mgetAsync(prefixedKeys)
      .then(this._parseRes)
      .tapCatch((err) => err.code !== 'NOT_FOUND' && this.logger.error('[REDIS][MGET]', err))
    ;
  }

  /**
   * https://redis.io/commands/hget
   * Returns the value associated with field in the hash stored at key.
   */
  hget(hash, key) {
    if (_.isUndefined(hash)) {
      const error = new Error('[REDIS][HGET] A hash is required.', key, hash);
      return Promise.reject(error);
    }

    if (_.isUndefined(key)) {
      const error = new Error('[REDIS][HGET] A key is required.', key, hash);
      return Promise.reject(error);
    }

    const prefixedHash = `${this.name}:${hash}`;
    return this.db.hgetAsync(prefixedHash, key)
      .then(this._parseRes)
      .tapCatch((err) => err.code !== 'NOT_FOUND' && this.logger.error('[REDIS][HGET]', err))
    ;
  }

  /**
  * https://redis.io/commands/hmget
  * Returns the values associated with the specified fields in the hash stored at key.
  * For every field that does not exist in the hash, a nil value is returned.
  * Because a non-existing keys are treated as empty hashes,
  * running HMGET against a non-existing key will return a list of nil values.
  */
  hmget(hash, keys) {
    if (_.isUndefined(hash)) {
      const error = new Error('[REDIS][HMGET] A hash is required.');
      return Promise.reject(error);
    }

    if (_.isUndefined(keys) || !_.isArray(keys)) {
      const error = new Error('[REDIS][HMGET] Keys needs to be an Array.', keys);
      return Promise.reject(error);
    }

    const prefixedHash = `${this.name}:${hash}`;
    return this.db.hmgetAsync(prefixedHash, keys)
      .then(this._parseRes)
      .tapCatch((err) => err.code !== 'NOT_FOUND' && this.logger.error('[REDIS][HMGET]', err))
    ;
  }

  /**
   * https://redis.io/commands/keys
   * Returns Array: list of keys matching pattern.
   */
  keys(pattern) {
    if (!pattern) {
      const error = new Error('[REDIS][KEYS] A pattern is required');
      return Promise.reject(error);
    }
    const prefixedPattern = `${this.name}:*${pattern}`;
    return this.db.keysAsync(prefixedPattern)
      .tapCatch((err) => this.logger.error('[REDIS][KEYS]', err))
    ;
  }

  /**
   * https://redis.io/commands/hkeys
   * Returns all field names in the hash stored at key.
   */
  hkeys(hash) {
    if (_.isUndefined(hash)) {
      const error = new Error('[REDIS][HKEYS] A hash is required.');
      return Promise.reject(error);
    }

    const prefixedHash = `${this.name}:${hash}`;
    return this.db.hkeysAsync(prefixedHash)
      .tapCatch((err) => this.logger.error('[REDIS][HKEYS]', err))
    ;
  }

  /**
   * https://redis.io/commands/hvals
   * Returns Array: list of values in the hash, or an empty list when key does not exist.
   */
  hvals(hash) {
    if (_.isUndefined(hash)) {
      const error = new Error('[REDIS][HVALS] A hash is required.');
      return Promise.reject(error);
    }

    const prefixedHash = `${this.name}:${hash}`;
    return this.db.hvalsAsync(prefixedHash)
      .then(this._parseRes)
      .tapCatch((err) => err.code !== 'NOT_FOUND' && this.logger.error('[REDIS][HVALS]', err))
    ;
  }

  /**
   * https://redis.io/commands/hgetall
   * Returns format depends on params formatRes:
   *  - 'keys': return Array of keys only
   *  - 'values': return Array of values only
   *  otherwise return map of key value
   */
  hgetall(hash, formatRes = 'map') {
    if (_.isUndefined(hash)) {
      const error = new Error('[REDIS][HGETALL] A hash is required.');
      return Promise.reject(error);
    }

    const prefixedHash = `${this.name}:${hash}`;
    return this.db.hgetallAsync(prefixedHash)
      .then((res) => {
        // sanitize outuput
        const map = _.reduce(res, (acc, value, key) => {
          acc[key] = this._parseRes(value);
          return acc;
        }, {});
        switch (formatRes) {
          case 'keys':
            return _.keys(map);
          case 'values':
            return _.values(map);
          default:
            return map;
        }
      })
      .tapCatch((err) => this.logger.error('[REDIS][HGETALL]', err))
    ;
  }

  /**
   * https://redis.io/commands/hdel
   * Removes the specified fields from the hash stored at key.
   * Specified fields that do not exist within this hash are ignored.
   * If key does not exist, it is treated as an empty hash and this command returns 0.
   * Returns Integer: number of fields that were removed from the hash,
   * not including specified but non existing fields.
   */
  hdel(hash, keys) {
    if (_.isUndefined(hash)) {
      const error = new Error('[REDIS][HDEL] A hash is required.');
      return Promise.reject(error);
    }

    if (_.isUndefined(keys)) {
      const error = new Error('[REDIS][HDEL] Keys are required.');
      return Promise.reject(error);
    }

    const array = _.isArray(keys) ? keys : [keys];
    const prefixedHash = `${this.name}:${hash}`;
    return this.db.hdelAsync(prefixedHash, ...array)
      .tapCatch((err) => this.logger.error('[REDIS][HDEL]', err))
    ;
  }

  /**
   * https://redis.io/commands/del
   * Removes the specified keys. A key is ignored if it does not exist.
   * Returns Integer: The number of keys that were removed
   */
  del(keys) {
    if (_.isUndefined(keys)) {
      const error = new Error('[REDIS][DEL] Keys are required.');
      return Promise.reject(error);
    }

    const array = _.isArray(keys) ? keys : [keys];
    const prefixedKeys = _.map(array, (key) => `${this.name}:${key}`);
    return this.db.delAsync(...prefixedKeys)
      .tapCatch((err) => this.logger.error('[REDIS][DEL]', err))
    ;
  }

  /**
   * https://redis.io/commands/exists
   * Returns the number of keys existing among the ones specified as arguments.
   * Keys mentioned multiple times and existing are counted multiple times.
   */
  exists(keys) {
    if (_.isUndefined(keys)) {
      const error = new Error('[REDIS][EXISTS] Keys are required.');
      return Promise.reject(error);
    }

    const array = _.isArray(keys) ? keys : [keys];
    const prefixedKeys = _.map(array, (key) => `${this.name}:${key}`);
    return this.db.existsAsync(...prefixedKeys)
      .tapCatch((err) => this.logger.error('[REDIS][EXISTS]', err))
    ;
  }

  /**
   * https://redis.io/commands/hexists
   * Returns if field is an existing field in the hash stored at key.
   * Returns 1 if the hash contains field.
   * 0 if the hash does not contain field, or key does not exist.
   */
  hexists(hash, keys) {
    if (_.isUndefined(hash)) {
      const error = new Error('[REDIS][HEXISTS] A hash is required.');
      return Promise.reject(error);
    }

    if (_.isUndefined(keys)) {
      const error = new Error('[REDIS][HEXISTS] Keys are required.');
      return Promise.reject(error);
    }

    if (_.isArray(keys)) {
      return Promise.all(_.map(keys, (key) => this.db.hexistsAsync(hash, key)))
        .tapCatch((err) => this.logger.error('[REDIS][HEXISTS][array]', err))
      ;
    }

    const prefixedHash = `${this.name}:${hash}`;
    return this.db.hexistsAsync(prefixedHash, keys)
      .tapCatch((err) => this.logger.error('[REDIS][HEXISTS][string]', err))
    ;
  }

  /**
   * https://redis.io/commands/scan
   * Returns Array of keys matching pattern
   */
  scan(pattern = '*', count = '2000') {
    const array = [];
    const cursor = '0';
    return this._scan(array, cursor, pattern, count)
      .then((res) => {
        this.logger.verbose(`[REDIS][SCAN] ${res}, found: ${_.size(array)} keys matching pattern: ${pattern}`);
        return array;
      })
      .tapCatch((err) => this.logger.error('[REDIS][SCAN]', err))
    ;
  }

  /**
   * Internal recursive function for scan
   */
  _scan(array, cursor, pattern, count) {
    return this.db.scanAsync(cursor, 'MATCH', pattern, 'COUNT', count)
      .then(([cursor, keys]) => {
        _.each(keys, (key) => array.push(key));
        if (cursor === '0') {
          return 'Done scanning';
        }

        return this._scan(array, cursor, pattern, count);
      })
    ;
  }

  /**
   * https://redis.io/commands/hscan
   * https://redis.io/commands/scan
   * Returns format depends on params formatRes:
   *  - 'keys': return Array of keys only
   *  - 'values': return Array of values only
   *  otherwise return map of key value
   */
  hscan(hash, pattern = '*', count = '2000', formatRes = 'map') {
    if (_.isUndefined(hash)) {
      const error = new Error('[REDIS][HEXISTS] A hash is required.');
      return Promise.reject(error);
    }

    const map = {};
    const cursor = '0';
    return this._hscan(map, hash, cursor, pattern, count)
      .then((res) => {
        this.logger.verbose(`[REDIS][SCAN] ${res}, found: ${_.size(_.keys(map))} keys matching pattern: ${pattern}` +
          ` for hash: ${hash}`);
        switch (formatRes) {
          case 'keys':
            return _.keys(map);
          case 'values':
            return _.values(map);
          default:
            return map;
        }
      })
      .tapCatch((err) => this.logger.error('[REDIS][SCAN]', err))
    ;
  }

  /**
   * Internal recursive function for hscan
   */
  _hscan(map, hash, cursor, pattern, count) {
    return this.db.hscanAsync(hash, cursor, 'MATCH', pattern, 'COUNT', count)
      .then(([cursor, keysAndValues]) => {
        let tmpKey;
        for (let i = 0; i < keysAndValues.length; i++) {
          if (i % 2 === 0) {
            tmpKey = keysAndValues[i];
            continue;
          }
          map[tmpKey] = this._parseRes(keysAndValues[i]);
        }
        if (cursor === '0') {
          return 'Done scanning';
        }

        return this._hscan(map, hash, cursor, pattern, count);
      })
    ;
  }
}
