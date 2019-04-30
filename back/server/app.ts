import * as express from 'express';
import { Promise } from 'bluebird';
import * as path from 'path';
import * as fs from 'fs';

import ServiceManager from './config/serviceManager/index';
import config from './config/environment/index';
import * as loggers from './config/loggers/index';
import expressConfig from './config/express/index';
import Server from './config/server/index';
import initRepositories from './config/repositories/index'; // if using a DB
import configRoutes from './config/controllers/index';
import { getAppVersion } from './config/environment/version';
// import HLFCONF from './config/environment/hlfConfig';

import { Notarization } from './components/blockchain/Notarization';
import ProductRegistry from './components/product/productRegistry';
import RequirementRegistry from './components/requirement/requirementRegistry';


// import { AccessServiceFactory } from '@blockchain-ibm-fr/blocknjser-access';
const access = require('@blockchain-ibm-fr/blocknjser-access');
const AccessServiceFactory = access.AccessServiceFactory;

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
  let HLFCONF: any;

  // if (fs.existsSync(__dirname + '/../resources/conf/renaultConfiguration.json')) {
  //   HLFCONF = JSON.parse(fs.readFileSync(__dirname + '/../resources/conf/renaultConfiguration.json', 'utf8'));
  // }
  if (fs.existsSync(process.env.CONFIGURATION_PATH)) {
    HLFCONF = JSON.parse(fs.readFileSync(process.env.CONFIGURATION_PATH, 'utf8'));
  }
  app.setOptions({
    logger: loggerT,
  });

  loggerT.info(`Démarrage du module ${config.appName}`);

  // Setting access service for authentification
  const accessFactory = new AccessServiceFactory();
  const accessService = accessFactory.create();
  app.set('AccessService', accessService, {onLoad: false, private: true});


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

  // Service that notarizes the blockchain
  const notarizationSDK = new Notarization(HLFCONF);
  app.set('Notarization', notarizationSDK, {onLoad: true, private: true});

  // Registries to interface with products/requirements
  const productRegistry = new ProductRegistry(notarizationSDK);
  app.set('ProductRegistry', productRegistry, {onLoad: false, private: true});
  const requirementRegistry = new RequirementRegistry(notarizationSDK);
  app.set('RequirementRegistry', requirementRegistry, {onLoad: false, private: true});

  return app.waitForUpAndRunning()
    .then(() => Promise.all([
      getAppVersion(config),
      notarizationSDK.deploy(),
      accessService.deploy(),
    ]), (err) => {
        loggerT.error(`L'application va s'arrêter pour ne pas provoquer d'erreur suite à: ${err.message}`);
        loggerT.verbose('Erreur critique', err);
        if (config.env === 'test') {
            return 'test exit';
        }
        process.exit(-1);
    })
    .then(() => Promise.all([
      notarizationSDK.init(),
      accessService.init(),
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
