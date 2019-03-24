/**
 * RamDB
 * 1.0.0
 */

import Promise from 'bluebird';

import RamDBRepository from './ramdbRepository';

export default class RamDB {
  constructor() {
    this.repository = RamDBRepository;
  }

  check() {
    return Promise.resolve(true);
  }
}
