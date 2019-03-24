/**
 * CouchDB
 * 2.2.1
 */

import Cloudant from 'cloudant';
import _ from 'lodash';
import Promise from 'bluebird';

import couchDBPromisePlugin from './couchdbPromisePlugin';
import CouchDBRequest from './couchdbRequest';
import CouchDBRepository from './couchdbRepository';

export default class CouchDB {
  constructor(params, logger) {
    this.logger = logger;
    this.params = params || {};

    if (!this.params.uri) {
      throw new Error('No URI found for couchDB');
    }

    this.logger.info(`[DB] Connexion au serveur couchDB ${this.params.uri}.`);
    this.couchDBServer = new Cloudant({ url: this.params.uri, plugin: couchDBPromisePlugin });

    this.db = _.reduce(this.params.db, (acc, dbConfig, dbName) => {
      this.logger.info(`[DB] Connexion à la base ${dbName}.`);
      acc[dbName] = this.couchDBServer.db.use(dbConfig);
      return acc;
    }, {});

    this.couchDBRequest = new CouchDBRequest(this, logger);
    this.repository = CouchDBRepository;
    this.repositoryData = {
      couchDBRequest: this.couchDBRequest,
      couchDBServer: this.couchDBServer,
    };
  }

  check() {
    return Promise.all(_.map(this.params.db, (dbConfig, dbName) => {
      return this.couchDBServer.db.get(dbConfig)
        .catch(() => {
          const error = new Error(`[DB] Unable to find ${dbName} [${dbConfig}] in the database, please create it.`);
          this.logger.error(error.message);
          return error;
        })
      ;
    }))
      .then((res) => {
        if (_.some(res, _.isError)) {
          return false;
        }
        this.logger.verbose('[DB] Toutes les bases de données sont bien présentes');
        return true;
      })
    ;
  }
}
