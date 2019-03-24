/**
 * CouchDBRepository
 * 1.4.2
 */

import Promise from 'bluebird';
import _ from 'lodash';

export default class Repository {
  constructor(params, db, data) {
    this.params = params;
    this.db = db;
    this.couchDBRequest = data.couchDBRequest;
    this.couchDBServer = data.couchDBServer;

    _.bindAll(this);
  }

  check() {
    return this.couchDBServer.db.get(this.db.config.db)
      .return(true)
      .catch(() => {
        const error = new Error(`[DB] Unable to find ${this.db.config.db} in the database, please create it.`);
        this.logger.error(error.message);
        return Promise.reject(error);
      })
    ;
  }

  get(id) {
    return this.db.get(id);
  }

  insert(doc) {
    if (!_.isObject(doc)) {
      throw new Error('An object is required to be inserted (no bulk mode in insert, use upsert instead)');
    }

    if (doc._id || doc._rev) {
      throw new Error('Unable to insert the document, _id or _rev is already provided in the body');
    }

    return this.db.insert(doc)
      .then(res => this.db.get(res.id))
    ;
  }

  upsert(docs) {
    // bulk mode
    if (_.isArray(docs)) {
      return this.db.bulk({ docs })
        .then(res => {
          _.each(res, (upserted, index) => {
            docs[index]._id = upserted.id;
            docs[index]._rev = upserted.rev;
          });
          return docs;
        })
      ;
    }

    return this.db.insert(docs)
      .then(docData => {
        const newDoc = _.cloneDeep(docs);
        newDoc._id = docData.id;
        newDoc._rev = docData.rev;

        return newDoc;
      })
    ;
  }

  update(id, doc) {
    if (!_.isObject(doc)) {
      throw new Error('An object is required to be updated (no bulk mode in update, use upsert instead)');
    }

    if (doc._id) {
      if (id !== doc._id) {
        throw new Error('Unable to update the document, _id in the body is different from given id');
      }
      delete doc._id;
    }

    if (!doc._rev) {
      throw new Error('Unable to update the document, _rev is not provided in the body');
    }

    return this.db.get(id)
      .then(entity => {
        return this.db.insert(doc, id)
          .then(res => {
            entity._rev = res.rev;
            return entity;
          })
        ;
      })
    ;
  }

  patch(id, body) {
    if (!_.isObject(body)) {
      throw new Error('An object is required to be patched (no bulk mode in patch, use upsert instead)');
    }

    if (body._id) {
      if (id !== body._id) {
        throw new Error('Unable to patch the document, _id in the body is different from given id');
      }
      delete body._id;
    }

    return this.db.get(id)
      .then(entity => {
        return this.db.insert(_.merge(entity, body), id)
          .then(res => {
            entity._rev = res.rev;
            return entity;
          })
        ;
      })
    ;
  }

  remove(idParam, revParam) {
    // bulk mode
    if (_.isArray(idParam)) {
      if (revParam) {
        throw new Error('No rev allowed if bulk mode requested');
      }

      return this.db.bulk({
        docs: _.map(idParam, doc => {
          return { _id: doc._id, _rev: doc._rev, _deleted: true };
        }),
      });
    }

    let id = idParam;
    let rev = revParam;
    if (_.isObject(idParam)) {
      if (revParam) {
        throw new Error('No rev allowed if object mode requested');
      }
      id = _.get(idParam, '_id');
      rev = _.get(idParam, '_rev');
    }

    if (rev) {
      return this.db.destroy(id, rev);
    }

    return this.db.get(id)
      .then(entity => this.db.destroy(id, entity._rev))
    ;
  }

  request(options, full = false) {
    return this.couchDBRequest.request(options, this, full);
  }

  list(startKey, includeDocs = true, endKey = startKey + '\ufff0') {
    if (!startKey) {
      return this.db.list()
        .then(res => Promise.map(res.rows, row => this.db.get(row.id)))
      ;
    }

    return this.couchDBRequest.list(this, startKey, includeDocs, endKey);
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
      .then(docs => _.first(docs))
      .then(doc => {
        if (doc) {
          return doc;
        }

        const err = new Error('NOT_FOUND');
        err.code = 'NOT_FOUND';
        err.statusCode = 404;
        return Promise.reject(err);
      })
    ;
  }
}
