/**
 * RamDBRepository
 * 1.0.0
 */

import Promise from 'bluebird';
import _ from 'lodash';
import uuid from 'uuid';

export default class Repository {
  constructor(config) {
    this.name = _.get(config, 'name');
    this.db = {};

    _.bindAll(this);
  }

  check() {
    return Promise.resolve(true);
  }

  get(id) {
    if (!this.db[id]) {
      const error = new Error('Not found');
      error.code = 'NOT_FOUND';
      return Promise.reject(error);
    }

    return Promise.resolve(this.db[id]);
  }

  set(key, value) {
    return this.upsert(_.merge({}, value, { _id: key }));
  }

  has(id) {
    return Promise.resolve(Boolean(this.db[id]));
  }

  exists(id) {
    return Promise.resolve(Boolean(this.db[id]));
  }

  upsert(docs) {
    // bulk mode
    if (_.isArray(docs)) {
      return Promise.map(docs, (doc) => this.upsert(doc));
    }

    if (!this.db[docs._id]) {
      const id = docs._id || uuid.v4();
      const insertedDoc = _.cloneDeep(docs);
      insertedDoc._id = id;
      this.db[id] = insertedDoc;

      return Promise.resolve(insertedDoc);
    }

    const upsertedDoc = _.cloneDeep(docs);
    this.db[docs._id] = upsertedDoc;

    return Promise.resolve(upsertedDoc);
  }

  remove(idParam) {
    // bulk mode
    if (_.isArray(idParam)) {
      return _.map(idParam, doc => this.remove(doc._id));
    }

    const id = _.isObject(idParam) ? _.get(idParam, '_id') : idParam;
    if (!this.db[id]) {
      return Promise.resolve({ status: 'ok' });
    }

    delete this.db[id];
    return Promise.resolve({ status: 'ok' });
  }

  request(options, full = false) {
    let collection = _.filter(this.db, options.selector);

    if (options.limit) {
      collection = _.take(collection, options.limit);
    }

    if (options.fields) {
      collection = _.map(collection, element => _.pick(element, options.fields));
    }

    if (options.sort) {
      collection = _.sort(collection, options.sort);
    }

    if (!_.size(collection)) {
      const err = new Error('Not found');
      err.code = 'NOT_FOUND';
      err.statusCode = 404;
      return Promise.reject(err);
    }

    if (!full) {
      return Promise.resolve(collection);
    }

    return Promise.resolve({
      docs: collection,
      totalRows: _.size(this.db),
    });
  }

  find(options = {}) {
    // set selector by default if no selector
    if (!options.selector) {
      options = { selector: options };
    }

    return this.request(options);
  }

  findOne(options) {
    // set selector by default if no selector
    if (!options.selector) {
      options = { selector: options };
    }

    return this.request(_.merge({ limit: 1 }, options))
      .then(docs => {
        if (_.size(docs) > 1) {
          const err = new Error('Too many found');
          err.code = 'TOO_MANY';
          err.statusCode = 404;
          return Promise.reject(err);
        }

        return _.first(docs);
      })
      .then(doc => {
        if (doc) {
          return doc;
        }

        const err = new Error('Not found');
        err.code = 'NOT_FOUND';
        err.statusCode = 404;
        return Promise.reject(err);
      })
    ;
  }
}
