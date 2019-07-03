/**
 * SqlDB
 * 1.0.0
 */

import * as mysql from 'mysql2';
import * as Promise from 'bluebird';

import SqlDBRepository from './sqldbRepository';

export default class SqlDB {

  public logger: any;
  public params: any;
  public pool: any;
  public repository: any;
  public repositoryData: any;


  public constructor(params, logger) {
    this.logger = logger;
    this.params = params || {};
    params['Promise'] = Promise;

    this.logger.info(`[DB] Connexion au serveur MySQL.`);
    this.pool = mysql.createPool(params);
    this.repository = SqlDBRepository;
    this.repositoryData = {};
  }

  public check() {

    return this.pool.getConnection((error, connection) => {
      if (error) {
          this.logger.error('Connection error.', error);
          return false;
      }

      this.logger.verbose('[DB] Toutes les bases de données sont bien présentes.');
      connection.release();
  });
  }
}
