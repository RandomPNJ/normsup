/**
 * ServiceManagerMock
 * 1.1.1
 */

import ServiceManager from './';

export default class ServiceManagerMock extends ServiceManager {
  constructor(...args) {
    super(...args);
    sinon.stub(this, 'isUpAndRunning').resolves(true);
    sinon.stub(this, 'waitForUpAndRunning').resolves(true);
    sinon.stub(this, 'setOptions');
  }

  restore() {
    sinon.reset(this.isUpAndRunning).resolves(true);
    sinon.reset(this.waitForUpAndRunning).resolves(true);
    sinon.reset(this.setOptions);

    this.services = [];
    this.onLoad = [];
    this.private = [];
  }
}
