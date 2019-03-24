/* eslint-disable max-nested-callbacks */
import _ from 'lodash';

import ServiceManager  from './config/serviceManager/serviceManagerMock';
import masterConfig from './config/environment';
import globalServiceManager from './app';
import * as loggers from './config/loggers';
// import * as registerAPI from './config/api'; // if using API requests
import * as expressConfig from './config/express';
import * as Server from './config/server';
// import * as SqlDB from './config/sqldb'; // if using sqlDB
// import * as CouchDB from './config/couchdb'; // if using couchDB
// import * as RedisDB from './config/redisdb'; // if using redisDB
// import * as RamDB from './config/ramdb'; // if using ramDB
// import * as initRepositories from './config/repositories'; // if using a DB
import * as configRoutes from './config/controllers';
// if using amqp
// import * as AmqpConnection from './config/amqp/connection';
// import * as amqp from './config/amqp';
// \if using amqp
import * as version from './config/environment/version';

describe('app service manager', () => {
  it('should return the service manager singleton of the app', () => {
    expect(globalServiceManager).to.be.an.instanceOf(ServiceManager);
  });

  it('should contain the integration app', () => {
    expect(globalServiceManager.has('integration')).to.be.true();
  });
});

describe('app', () => {
  let app;
  let serviceManager;
  let config;

  beforeEach(() => {
    config = _.cloneDeep(masterConfig);
    serviceManager = new ServiceManager();
    app = globalServiceManager.get('integration');
  });

  afterEach(() => {
    serviceManager.restore();
  });

  it('should define a stop method (only used in test)', () => {
    expect(app).to.have.property('stop').that.is.a('Function');
  });

  describe('::start', () => {
    let server;
    // let redisDB; // if using redisDB

    beforeEach(() => {
      sinon.stub(loggers, 'init');
      sinon.stub(loggerT, 'info');
      sinon.stub(serviceManager, 'set').callThrough();
      // sinon.stub(registerAPI, 'default'); // if using API requests
      server = sinon.createStubInstance(Server.default);
      sinon.stub(Server, 'default').callsFake(() => server);
      // sinon.stub(SqlDB, 'default').callsFake(() => sinon.createStubInstance(SqlDB.default)); // if using sqlDB
      // sinon.stub(CouchDB, 'default').callsFake(() => sinon.createStubInstance(CouchDB.default)); // if using couchDB
      // if using redisDB
      // redisDB = sinon.createStubInstance(RedisDB.default);
      // redisDB.start.resolves();
      // sinon.stub(RamDB, 'default').callsFake(() => sinon.createStubInstance(RamDB.default)); // if using ramDB
      // sinon.stub(RedisDB, 'default').callsFake(() => redisDB);
      // \if using redisDB
      // sinon.stub(initRepositories, 'default'); // if using a DB
      sinon.stub(expressConfig, 'default');
      sinon.stub(configRoutes, 'default').returns({});
      // sinon.stub(AmqpConnection, 'default').callsFake(() => sinon.createStubInstance(AmqpConnection.default)); // if using amqp
      sinon.stub(version, 'getAppVersion').resolves();
      // sinon.stub(amqp, 'startAllMQ'); // if using amqp
      server.start.resolves();
      sinon.stub(loggerT, 'error');
    });

    afterEach(() => {
      loggers.init.restore();
      loggerT.info.restore();
      serviceManager.set.restore();
      // registerAPI.default.restore(); // if using API requests
      Server.default.restore();
      // SqlDB.default.restore(); // if using sqlDB
      // CouchDB.default.restore(); // if using couchDB
      // RedisDB.default.restore(); // if using redisDB
      // RamDB.default.restore(); // if using ramDB
      // initRepositories.default.restore(); // if using a DB
      expressConfig.default.restore();
      configRoutes.default.restore();
      // AmqpConnection.default.restore(); // if using amqp
      version.getAppVersion.restore();
      // amqp.startAllMQ.restore(); // if using amqp
      loggerT.error.restore();
    });

    it('should exist', () => {
      expect(app).to.have.property('start').that.is.a('Function');
    });

    describe('logs', () => {
      it('should init loggers', () => {
        return app.start(serviceManager, config)
          .then(() => {
            expect(loggers.init).to.have.been.calledOnce();
          })
        ;
      });

      it('should set a logger as service manager logger', () => {
        return app.start(serviceManager, config)
          .then(() => {
            expect(serviceManager.setOptions).to.have.been.calledOnce();
          })
        ;
      });

      it('should log about starting the app', () => {
        return app.start(serviceManager, config)
          .then(() => {
            expect(loggerT.info).to.have.been.called();
          })
        ;
      });
    });

    describe('statics', () => {
      it('should register config', () => {
        return app.start(serviceManager, config)
          .then(() => {
            expect(serviceManager.set).to.have.been.calledWith('config');
          })
        ;
      });

      it('should set NODE_TLS_REJECT_UNAUTHORIZED to 0', () => {
        config.SELF_SIGNED_SSL = false;
        return app.start(serviceManager, config)
          .then(() => {
            expect(process.env.NODE_TLS_REJECT_UNAUTHORIZED).to.equal('0');
          })
        ;
      });

      // if using API requests
      // it('should register APIs', () => {
      //   return app.start(serviceManager, config)
      //     .then(() => {
      //       expect(registerAPI.default).to.have.been.calledOnce();
      //     })
      //   ;
      // });
      // \if using API requests
    });

    describe('express', () => {
      it('should create a server', () => {
        return app.start(serviceManager, config)
          .then(() => {
            expect(Server.default).to.have.been.calledOnce();
          })
        ;
      });

      it('should configure express', () => {
        return app.start(serviceManager, config)
          .then(() => {
            expect(expressConfig.default).to.have.been.calledOnce();
          })
        ;
      });

      it('should register express app as server that use http server', () => {
        return app.start(serviceManager, config)
          .then(() => {
            expect(serviceManager.set).to.have.been.calledWith('server');
            expect(serviceManager.set).to.have.been.calledWith('expressApp');
          })
        ;
      });
    });

    // if using a DB
    // describe('repositories', () => {
    //   it('should create DB', () => {
    //     return app.start(serviceManager, config)
    //       .then(() => {
    //         expect(SqlDB.default).to.have.been.calledOnce(); // if using sqlDB
    //         expect(CouchDB.default).to.have.been.calledOnce(); // if using couchDB
    //         expect(RedisDB.default).to.have.been.calledOnce(); // if using redisDB
    //         expect(RamDB.default).to.have.been.calledOnce(); // if using ramDB
    //       })
    //     ;
    //   });
    //
    //   it('should register db', () => {
    //     return app.start(serviceManager, config)
    //       .then(() => {
    //         expect(serviceManager.set).to.have.been.calledWith('db:sqlDB'); // if using sqlDB
    //         expect(serviceManager.set).to.have.been.calledWith('db:couchDB'); // if using couchDB
    //         expect(serviceManager.set).to.have.been.calledWith('db:redisDB'); // if using redisDB
    //         expect(serviceManager.set).to.have.been.calledWith('db:ramDB'); // if using ramDB
    //       })
    //     ;
    //   });
    //
    //   it('should initialize repositories', () => {
    //     return app.start(serviceManager, config)
    //       .then(() => {
    //         expect(initRepositories.default).to.have.been.calledOnce();
    //       })
    //     ;
    //   });
    // });
    // \if using a DB

    describe('swagger', () => {
      it('should configure routes from repository', () => {
        return app.start(serviceManager, config)
          .then(() => {
            expect(configRoutes.default).to.have.been.calledOnce();
          })
        ;
      });

      it('should register swagger', () => {
        return app.start(serviceManager, config)
          .then(() => {
            expect(serviceManager.set).to.have.been.calledWith('swagger');
          })
        ;
      });
    });

    // if using amqp
    // describe('mq connection', () => {
    //   it('should initialize mq connection', () => {
    //     return app.start(serviceManager, config)
    //       .then(() => {
    //         expect(AmqpConnection.default).to.have.been.calledOnce();
    //       })
    //     ;
    //   });
    //
    //   it('should register mq connection', () => {
    //     return app.start(serviceManager, config)
    //       .then(() => {
    //         expect(serviceManager.set).to.have.been.calledWith('mq:connection');
    //       })
    //     ;
    //   });
    // });
    // \if using amqp

    // if using redisDB
    // it('should start redisDB', () => {
    //   return app.start(serviceManager, config)
    //     .then(() => {
    //       expect(redisDB.start).to.have.been.calledOnce();
    //     })
    //   ;
    // });
    // \if using redisDB

    it('should wait for required deps to be up', () => {
      return app.start(serviceManager, config)
        .then(() => {
          expect(serviceManager.waitForUpAndRunning).to.have.been.calledOnce();
        })
      ;
    });

    it('should get version', () => {
      return app.start(serviceManager, config)
        .then(() => {
          expect(version.getAppVersion).to.have.been.calledOnce();
        })
      ;
    });

    // if using amqp
    // it('should start all MQ', () => {
    //   return app.start(serviceManager, config)
    //     .then(() => {
    //       expect(amqp.startAllMQ).to.have.been.calledOnce();
    //     })
    //   ;
    // });
    // \if using amqp

    it('should start express server', () => {
      return app.start(serviceManager, config)
        .then(() => {
          expect(server.start).to.have.been.calledOnce();
        })
      ;
    });

    it('should log error if error', () => {
      sinon.reset(serviceManager.waitForUpAndRunning).rejects(new Error('waitForUpAndRunning error'));
      return app.start(serviceManager, config)
        .then((res) => {
          expect(loggerT.error).to.have.been.calledOnce();
          expect(res).to.equal('test exit');
        })
      ;
    });
  });
});
