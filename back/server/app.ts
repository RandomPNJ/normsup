import * as express from 'express';
import { Promise } from 'bluebird';
import * as path from 'path';
import * as fs from 'fs';
import * as AWSDK from 'aws-sdk';

import ServiceManager from './config/serviceManager/index';
import config from './config/environment/index';
import * as loggers from './config/loggers/index';
import expressConfig from './config/express/index';
import Server from './config/server/index';
import initRepositories from './config/repositories/index'; // if using a DB
import configRoutes from './config/controllers/index';
import SqlDB from './config/sqldb'; // if using sqlDB
import { getAppVersion } from './config/environment/version';

import UserRegistry from './components/users/usersRegistry';
import DocumentsRegistry from './components/documents/documentsRegistry';
import SupplierRegistry from './components/supplier/supplierRegistry';
import SettingsRegistry from './components/settings/settingsRegistry';
import AdminRegistry from './components/admin/adminRegistry';
import AuthRegistry from './components/auth/authRegistry';

const app = global['app'] || new ServiceManager({ retryUpAndRunning: -1 });

/* istanbul ignore if */
if (config.AUTOSTART) {
  start(app, config);
}
declare var loggerT: any;
declare var loggerIO: any;

function start(app: any, config: any): any {

  // Initialisation des loggers/monitoring
  loggers.init(config.env, config.LOG_DIR, config.loggers, app);
  app.set('loggerT', loggerT, { private: true });
  app.set('loggerIO', loggerIO, { private: true });

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

  // generate express and routes
  const expressApp = express();
  app.set('expressApp', expressApp, { private: true });
  expressConfig(expressApp);
  const server = new Server(expressApp, config, loggerT);
  app.set('server', server, { private: true });

  // Initialisation de SqlDB
  const sqlDB = new SqlDB(config.mysqlParams, loggerT);
  app.set('db:sqlDB', sqlDB, { onLoad: true });

  // Initialisation des repositories
  initRepositories(app, config.repositories);

  // Initialisation des routes
  const apiRoot = path.join(__dirname, './api');
  const swagger = configRoutes(expressApp, app, config.model, {
    apiRoot,
    logger: loggerIO,
    showStack: config.env !== 'production',
  });
  app.set('swagger', swagger, { private: true });

  // Init s3 object
  AWSDK.config.update(config.s3Params.s3Options);
  const s3Client = new AWSDK.S3();
  app.set('s3', s3Client, {onLoad: true});

  // Registries to interface with products/requirements
  const supplierRegistry = new SupplierRegistry(sqlDB);
  app.set('SupplierRegistry', supplierRegistry, {onLoad: true});
  const docRegistry = new DocumentsRegistry(sqlDB, s3Client);
  app.set('DocumentsRegistry', docRegistry, {onLoad: true});
  const userRegistry = new UserRegistry(sqlDB);
  app.set('UsersRegistry', userRegistry, {onLoad: true});
  const settingsRegistry = new SettingsRegistry(sqlDB);
  app.set('SettingsRegistry', settingsRegistry, {onLoad: true});
  const adminRegistry = new AdminRegistry(sqlDB);
  app.set('AdminRegistry', adminRegistry, {onLoad: true});


  return app.waitForUpAndRunning()
    .then(() => Promise.all([
      getAppVersion(config),
    ]), (err) => {
        loggerT.error(`L'application va s'arrêter pour ne pas provoquer d'erreur suite à: ${err.message}`);
        loggerT.verbose('Erreur critique', err);
        if (config.env === 'test') {
            return 'test exit';
        }
        process.exit(-1);
    })
    .then(() => Promise.all([
      server.start(),
    ]), (err) => {
        loggerT.error(`L'application va s'arrêter pour ne pas provoquer d'erreur suite à: ${err.message}`);
        loggerT.verbose('Erreur critique', err);
        if (config.env === 'test') {
            return 'test exit';
        }
        process.exit(-1);
    })
  ;
}

function stop(app: any): any {
  return Promise.all([
    stopServer(app),
  ]);
}

function stopServer(app: any): any {
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
