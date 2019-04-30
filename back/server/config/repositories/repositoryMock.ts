/**
 * RepositoryMock
 * 1.3.1
 */

import * as _ from 'lodash';
const sinon = require('sinon');

export default class RepositoryMock {

  check: any;
  get: any;
  has: any;
  insert: any;
  upsert: any;
  update: any;
  patch: any;
  remove: any;
  request: any;
  list: any;
  find: any;
  findOne: any;

  constructor() {
    this.check = _.noop;
    this.get = _.noop;
    this.has = _.noop;
    this.insert = _.noop;
    this.upsert = _.noop;
    this.update = _.noop;
    this.patch = _.noop;
    this.remove = _.noop;
    this.request = _.noop;
    this.list = _.noop;
    this.find = _.noop;
    this.findOne = _.noop;

    sinon.stub(this, 'check');
    sinon.stub(this, 'get');
    sinon.stub(this, 'has');
    sinon.stub(this, 'insert');
    sinon.stub(this, 'upsert');
    sinon.stub(this, 'update');
    sinon.stub(this, 'patch');
    sinon.stub(this, 'remove');
    sinon.stub(this, 'request');
    sinon.stub(this, 'list');
    sinon.stub(this, 'find');
    sinon.stub(this, 'findOne');

    this._setBehavior();
  }

  restore() {
    sinon.reset(this.check);
    sinon.reset(this.get);
    sinon.reset(this.has);
    sinon.reset(this.insert);
    sinon.reset(this.upsert);
    sinon.reset(this.update);
    sinon.reset(this.patch);
    sinon.reset(this.remove);
    sinon.reset(this.request);
    sinon.reset(this.list);
    sinon.reset(this.find);
    sinon.reset(this.findOne);

    this._setBehavior();
  }

  _setBehavior() {
    this.check.resolves(true);
    this.get.resolves({});
    this.has.resolves(true);
    this.insert.resolves({});
    this.upsert.resolves();
    this.update.resolves({});
    this.patch.resolves({});
    this.remove.resolves();
    this.request.resolves([]);
    this.list.resolves([]);
    this.find.resolves([]);
    this.findOne.resolves({});
  }
}
