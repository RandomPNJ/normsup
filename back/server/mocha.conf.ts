/**
 * Mocha global config
 * 1.1.1
 */

import * as chai from 'chai';
import * as dirtyChai from 'dirty-chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as chaiThings from 'chai-things';
import 'chai-http';
import {Promise} from 'bluebird';

// provides a set of custom assertions for using the Sinon.JS spy, stub, and mocking framework
// with the Chai assertion
chai.use(sinonChai);

// Chai as Promised extends Chai with a fluent language for asserting facts about promises.
chai.use(chaiAsPromised);

// Chai Things adds support to Chai for assertions on array elements.
chai.use(chaiThings);

// Extend Chai Assertion library with tests for http apis
chai.use(require('chai-http'));

// Function form for terminating assertion properties.
chai.use(dirtyChai);

// add globals
global['sinon'] = sinon.sandbox.create();
global['expect'] = chai.expect;
global['chai'] = chai;
global['sinon'].usingPromise(Promise); // use bluebird in sinon.stub promises (resolves, rejects)
// Based on sinon 2.2.X, that delete defaultBehavior, which hold bluebird as promise
global['sinon'].reset = function (stub) {
  stub.resetHistory();
  const defaultBehavior = stub.defaultBehavior;
  stub.resetBehavior();
  stub.defaultBehavior = defaultBehavior;
  return stub;
};
