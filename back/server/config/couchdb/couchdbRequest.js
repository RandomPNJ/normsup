/**
 * CouchDB request
 * 1.3.1
 */

import Promise from 'bluebird';
import _ from 'lodash';

import Repository from './couchdbRepository';

export default class CouchDBRequest {
  constructor(couchDB, logger) {
    this.couchDB = couchDB;
    this.requestDefaults = {
      doc: '_find',
      method: 'POST',
      body: {
        limit: this.couchDB.params.maxResults,
      },
    };

    this.listDefaults = {
      doc: '_all_docs',
      method: 'GET',
      qs: {
        limit: this.couchDB.params.maxResults,
      },
    };

    this.logger = logger;
  }

  getDb(db, options) {
    if (db) {
      if (_.isString(db)) {
        return db;
      }

      if (db instanceof Repository) {
        return db.db.config.db;
      }

      return db.config.db;
    }

    if (options.collection && _.isString(options.collection)) {
      return options.collection;
    }

    if (options.repository && options.repository instanceof Repository) {
      return options.repository.db.config.db;
    }

    if (options.db) {
      return options.db.config.db;
    }

    throw new Error('No DB found in request options');
  }

  request(options, db, full = false) {
    const localOptions = _.cloneDeep(this.requestDefaults);

    localOptions.db = this.getDb(db, options);
    _.merge(localOptions.body, _.omit(options, ['repository', 'collection', 'db']));

    if (localOptions.body.useIndex) {
      localOptions.body.use_index = localOptions.body.useIndex; // eslint-disable-line camelcase
      delete localOptions.body.useIndex;
    }

    if (!localOptions.body.selector) {
      this.logger.error('Invalid query, no selector found', {localOptions});
      throw new Error('Invalid query, no selector found');
    }

    if (!localOptions.body.use_index) { // eslint-disable-line camelcase
      this.logger.debug('No index in CouchDB request', options);
    }

    this.logger.verbose('Request to CouchDB', localOptions);
    return this.couchDB.couchDBServer.request(localOptions)
      .then(docs => {
        if (!full) {
          return docs.docs;
        }

        const data = _.omit(docs, 'total_rows');
        data.totalRows = docs.total_rows; // eslint-disable-line camelcase
        return data;
      })
      .catch(err => {
        this.logger.error(`An error occured in CouchDB request: ${err.message}`, {err, localOptions});
        return Promise.reject(err);
      })
    ;
  }

  list(repository, startKey, includeDocs = true, endKey = startKey + '\ufff0') {
    const localOptions = _.cloneDeep(this.listDefaults);

    localOptions.db = this.getDb(null, { repository });
    localOptions.qs.startkey = startKey;
    localOptions.qs.endkey = endKey;
    localOptions.qs.include_docs = includeDocs; // eslint-disable-line camelcase

    this.logger.verbose('List to CouchDB', localOptions);
    return this.couchDB.couchDBServer.request(localOptions)
      .then(res => _.map(res.rows, 'doc'))
    ;
  }
}
