/**
 * SqlDBRepository
 * 1.1.0
 */

export default class SqlDBRepository {
  constructor(params, db) {
    this.params = params;
    this.db = db.pool;
    this.formatter = db.formatter;
  }
}
