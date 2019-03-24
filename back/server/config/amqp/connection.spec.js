/**
 * Connection tests
 * 1.0.1
 * params: {
 *  uri: String
 *  options: Object
 * }
 */

import Promise from 'bluebird';
import _ from 'lodash';

import AmqpConnection from './connection.js';
import MockLogger from '../loggers/mockLogger';

describe('::AmqpConnection', () => {
  let logger;

  beforeEach(() => {
    logger = new MockLogger();
    sinon.stub(logger, 'debug');
    sinon.stub(logger, 'error');
    sinon.stub(logger, 'info');
  });

  describe('::start', () => {
    it('should exist', () => {
      const amqp = new AmqpConnection({ uri: 'fakeuri'}, logger);
      expect(amqp).to.have.property('start').that.is.a('Function');
    });

    it('should create a new connection and attach events');
  }); // ::start

  describe('::resolveAll', () => {
    let logger;

    beforeEach(() => {
      logger = new MockLogger();
      sinon.stub(logger, 'debug');
      sinon.stub(logger, 'error');
      sinon.stub(logger, 'warn');
      sinon.stub(logger, 'verbose');
      sinon.spy(_, 'size');
      sinon.spy(_, 'forEach');
      sinon.spy(_, 'map');
    });

    afterEach(() => {
      _.size.restore();
      _.forEach.restore();
      _.map.restore();
    });

    it('should call all pending resolve', () => {
      const amqp = new AmqpConnection({ uri: 'fakeuri'}, logger);
      amqp.waitingForConnection.producer = [Promise.resolve, Promise.resolve];
      amqp.resolveAll();
      expect(_.forEach).to.have.been.called();
      expect(_.map).to.have.been.called();
      expect(logger.verbose).to.have.been.calledTwice();
      expect(amqp.waitingForConnection.producer.length).to.equal(0);
    });

    it('should not do anything if no getConnection are pending', () => {
      const amqp = new AmqpConnection({ uri: 'fakeuri'}, logger);
      amqp.resolveAll();
      expect(_.size).to.have.been.calledOnce();
      expect(logger.warn).to.have.been.calledOnce();
    });

    it('should exist', () => {
      const amqp = new AmqpConnection({ uri: 'fakeuri'}, logger);
      expect(amqp).to.have.property('resolveAll').that.is.a('Function');
    });
  }); // ::resolveAll

  describe('::getConnection', () => {
    let logger;

    beforeEach(() => {
      logger = new MockLogger();
      sinon.stub(logger, 'debug');
      sinon.stub(logger, 'error');
      sinon.stub(logger, 'info');
      sinon.stub(logger, 'verbose');
    });

    it('should exist', () => {
      const amqp = new AmqpConnection({ uri: 'fakeuri'}, logger);
      expect(amqp).to.have.property('getConnection').that.is.a('Function');
    });

    it('should not start a new connection if it exists and is busy', () => {
      const amqp = new AmqpConnection({ uri: 'fakeuri'}, logger);
      amqp.isBlocked = true;
      sinon.stub(amqp, 'start').resolves();
      const promise = amqp.getConnection('producer');
      amqp.connection = 'fakeConnection';
      amqp.waitingForConnection.producer[0]('fakeConnection');
      return promise
        .then((res) => {
          expect(logger.debug).to.have.been.calledOnce();
          expect(amqp.start).to.not.have.been.called();
          expect(res).to.equal('fakeConnection');
        })
      ;
    });

    it('should start a new connection if it is not already connecting', () => {
      const amqp = new AmqpConnection({ uri: 'fakeuri'}, logger);
      sinon.stub(amqp, 'start').resolves();
      const promise = amqp.getConnection('producer');
      amqp.connection = 'fakeConnection';
      amqp.waitingForConnection.producer[0]('fakeConnection');
      return promise
        .then((res) => {
          expect(logger.debug).to.have.been.calledOnce();
          expect(logger.info).to.have.been.calledOnce();
          expect(logger.verbose).to.have.been.calledOnce();
          expect(amqp.start).to.have.been.calledOnce();
          expect(res).to.equal('fakeConnection');
        })
      ;
    });

    it('should return connection if it exists', () => {
      const amqp = new AmqpConnection({ uri: 'fakeuri'}, logger);
      amqp.connection = 'fakeConnection';
      return amqp
        .getConnection('producer')
        .then((res) => {
          expect(logger.debug).to.have.been.called();
          expect(res).to.equal('fakeConnection');
        })
      ;
    });
  }); // ::getConnection

  describe('::constructor', () => {
    it('should throw if params.uri is undefined', () => {
      const error = '[MQ - connection] An uri is required to connect to MQ';
      expect(() => new AmqpConnection()).to.throw(error);
    });

    it('should create a new instance', () => {
      const amqp = new AmqpConnection({ uri: 'fakeuri'});
      expect(amqp).to.have.property('connection').that.is.null();
      expect(amqp).to.have.property('isBlocked').that.is.false();
      expect(amqp).to.have.property('isClosed').that.is.true();
      expect(amqp).to.have.property('restartTimeout').that.equal(60000);
      expect(amqp).to.have.property('waitingForConnection').that.deep.equal({});
      expect(amqp).to.have.property('connecting').that.is.false();
      expect(amqp).to.have.property('timeout').that.is.null();
    });
  });

  describe('::stop', () => {
    beforeEach(() => {
      sinon.spy(_, 'isNull');
    });

    afterEach(() => {
      _.isNull.restore();
    });

    it('return if connection is null', () => {
      const amqp = new AmqpConnection({ uri: 'fakeuri'});
      return amqp
        .stop()
        .then((res) => {
          expect(res).to.equal('connection is Null');
        })
      ;
    });

    it('should close connection if it exists', () => {
      const amqp = new AmqpConnection({ uri: 'fakeuri'});
      amqp.connection = {};
      amqp.connection.close = sinon.stub().resolves();
      return amqp
        .stop()
        .then((res) => {
          expect(_.isNull).to.have.been.calledOnce();
          expect(amqp.connection).to.be.null();
          expect(res).to.equal('connection has been closed');
        })
      ;
    });

    it('should delete restart timeout before closing connection', () => {
      const amqp = new AmqpConnection({ uri: 'fakeuri'});
      amqp.timeout = setTimeout(() => {}, 3000);
      amqp.connection = {};
      amqp.connection.close = sinon.stub().resolves();
      return amqp
        .stop()
        .then((res) => {
          expect(_.isNull).to.have.been.calledOnce();
          expect(amqp.timeout).to.be.null();
          expect(amqp.connection).to.be.null();
          expect(res).to.equal('connection has been closed');
        })
      ;
    });
  });

  describe('::check', () => {
    it('should exist', () => {
      const amqp = new AmqpConnection({ uri: 'fakeuri'}, logger);
      expect(amqp).to.have.property('check').that.is.a('Function');
    });

    it('should check amqp server by opening a connection on it to return true');
    it('should return false if connection can\'t be opened');
  });
});
