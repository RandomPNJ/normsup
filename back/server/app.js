import express from 'express';
import Promise from 'bluebird';
import path from 'path';

import ServiceManager from './config/serviceManager';
import config from './config/environment';
import * as loggers from './config/loggers';
// import registerAPI from './config/api'; // if using API requests
import expressConfig from './config/express';
import Server from './config/server';
// import SqlDB from './config/sqldb'; // if using sqlDB
// import CouchDB from './config/couchdb'; // if using couchDB
// import RedisDB from './config/redisdb'; // if using redisDB
// import RamDB from './config/ramdb'; // if using ramDB
// import initRepositories from './config/repositories'; // if using a DB
import configRoutes from './config/controllers';
// if using amqp
// import AmqpConnection from './config/amqp/connection';
// import { startAllMQ, stopAllMQ } from './config/amqp';
// \if using amqp
import { getAppVersion } from './config/environment/version';

// import components here

const app = global.app || new ServiceManager({ retryUpAndRunning: -1 });

/* istanbul ignore if */
if (config.AUTOSTART) {
  start(app, config);
}

function start(app, config) {
  // Initialisation des loggers/monitoring
  loggers.init(config.env, config.LOG_DIR, config.loggers, app);
  app.setOptions({
    logger: loggerT,
  });

  loggerT.info(`Démarrage du module ${config.appName}`);

  // init static config
  app.set('config', config, { private: true });
  if (!app.has('integration')) {
    app.set('integration', { start, stop }, { private: true });
  }

  if (config.SELF_SIGNED_SSL) {
    // send autosigned SSL requests
    // TODO check type
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  // if using API requests
  // static APIs
  // registerAPI(app, config.api, loggerT);
  // \if using API requests

  // generate express and routes
  const expressApp = express();
  app.set('expressApp', expressApp, { private: true });
  expressConfig(expressApp);
  const server = new Server(expressApp, config, loggerT);
  app.set('server', server, { private: true });

  // if using a DB

  // if using sqlDB
  // Initialisation de SqlDB
  // const sqlDB = new SqlDB(config.sqlDB, loggerT);
  // app.set('db:sqlDB', sqlDB, { onLoad: true });
  // \if using sqlDB

  // if using couchDB
  // Initialisation de CouchDB
  // const couchDB = new CouchDB(config.couchDB, loggerT);
  // app.set('db:couchDB', couchDB, { onLoad: true });
  // \if using couchDB

  // if using redisDB
  // Initialisation de RedisDB
  // const redisDB = new RedisDB(config.redisDB, loggerT);
  // app.set('db:redisDB', redisDB, { onLoad: true });
  // \if using redisDB

  // if using ramDB
  // Initialisation de la RamDB
  // const ramDB = new RamDB();
  // app.set('db:ramDB', ramDB, { onLoad: true });
  // \if using ramDB

  // Initialisation des repositories
  // initRepositories(app, config.repositories, {
  //   repositoriesRoot: __dirname,
  // });

  // \if using a DB

  // Initialisation des routes
  const apiRoot = path.join(__dirname, './api');
  const swagger = configRoutes(expressApp, app, config.model, {
    apiRoot,
    logger: loggerIO,
    showStack: config.env !== 'production',
  });
  app.set('swagger', swagger, { private: true });

  // if using amqp
  // Initialisation de la connexion rabbit
  // const mqConnection = new AmqpConnection(config.amqp, loggerT);
  // app.set('mq:connection', mqConnection, { private: true, onLoad: true });
  // \if using amqp

  /* LOAD YOUR COMPONENTS HERE

    const myComp = new Comp();
    app.set('myComp', myComp, options)

    options: {
      onload: Bool,
      private: Bool
    }
  */

  // if using redisDB
  // return redisDB.start()
  //   .then(() => app.waitForUpAndRunning())
  // \ if using redisDB
  return app.waitForUpAndRunning()
    .then(() => Promise.all([
      getAppVersion(config),
      server.start(),
      // startAllMQ(app), // if using amqp
      // START MORE STUFF HERE
    ]))
    .catch(err => {
      loggerT.error(`L'application va s'arrêter pour ne pas provoquer d'erreur suite à: ${err.message}`);
      loggerT.verbose('Erreur critique', err);
      if (config.env === 'test') {
        return 'test exit';
      }
      process.exit(-1);
    })
  ;
}

function stop(app) {
  return Promise.all([
    stopServer(app),
    // stopAllMQ(app), // if using amqp
    // STOP MORE STUFF HERE
  ]);
}

function stopServer(app) {
  if (!app.has('server')) {
    return Promise.resolve();
  }

  return app.get('server').stop()
    .tap(() => app.unset('server'))
  ;
}

if (!app.has('integration')) {
  app.set('integration', { start, stop }, { private: true });
}

export default app;
