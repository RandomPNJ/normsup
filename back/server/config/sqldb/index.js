/**
 * SqlDB
 * 1.1.0
 */

import pg from 'pg-promise';
import Promise from 'bluebird';

import SqlDBRepository from './sqldbRepository';

export default class SqlDB {
  constructor(params, logger) {
    this.logger = logger;
    this.params = params || {};

    if (!this.params.uri) {
      throw new Error('No URI found for sqlDB');
    }

    // use bluebird as promise
    const pgp = pg({
      promiseLib: Promise,
    });

    this.logger.info(`[DB] Connexion au serveur sqlDB ${this.params.uri}.`);
    this.pool = pgp(this.params.uri);
    this.formatter = pgp.as;

    this.repository = SqlDBRepository;
    this.repositoryData = {};
  }

  check() {
    return this.pool.connect()
      .then((client) => {
        this.logger.verbose('[DB] Toutes les bases de données sont bien présentes');
        client.done();
        return true;
      })
      .catch(() => {
        return false;
      })
    ;
  }
}
