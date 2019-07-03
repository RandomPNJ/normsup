/**
 * SqlDBRepository
 * 1.1.0
 */

export default class SqlDBRepository {

  public params: any;
  public db: any;

  public constructor(params, db) {
    this.params = params;
    this.db = db.pool;
  }
}
