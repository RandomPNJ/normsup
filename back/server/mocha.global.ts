/**
 * Mocha mock config
 * 1.1.2
 */

import * as _ from 'lodash';

import config from './config/environment';
import * as fs from 'fs';

import { Notarization } from './components/blockchain/Notarization';
import ProductRegistry from './components/product/productRegistry';
import RequirementRegistry from './components/requirement/requirementRegistry';
import MockLogger from './config/loggers/mockLogger';
import ServiceManager from './config/serviceManager/serviceManagerMock';
import Repository from './config/repositories/repositoryMock';
import API from './config/api/apiMock';

// TODO : TEST SERVER FROM WEB APP DOCKER CONTAINER AND REMOVE USELESS AND ERROR PRONE DUPLICATE

const access = require('@blockchain-ibm-fr/blocknjser-access');
const AccessServiceFactory = access.AccessServiceFactory;

config.AUTOSTART = false;

const app = new ServiceManager({ noCheck: true });
let HLFCONF: any;
// Service that notarizes the blockchain
if (fs.existsSync(process.env.CONFIGURATION_PATH)) {
  HLFCONF = JSON.parse(fs.readFileSync(process.env.CONFIGURATION_PATH, 'utf8'));
}
const notarizationSDK = new Notarization(HLFCONF);
app.set('Notarization', notarizationSDK, {onLoad: true, private: true});

const accessFactory = new AccessServiceFactory();
const accessService = accessFactory.create();
app.set('AccessService', accessService, {onLoad: false, private: true});

// Registries to interface with products/requirements
const productRegistry = new ProductRegistry(notarizationSDK);
app.set('ProductRegistry', productRegistry, {onLoad: false, private: true});
const requirementRegistry = new RequirementRegistry(notarizationSDK);
app.set('RequirementRegistry', requirementRegistry, {onLoad: false, private: true});


// don't show logs while testing
_.forEach(config.loggers, (val, key) => {
  global[key] = new MockLogger();
  app.set('logger:' + key, global[key]);
});

app.set('config', config);

_.forEach(config['repositories'], (val, key) => {
  app.set('repository:' + key, new Repository(), {
    aliases: val.aliases,
  });
});

_.forEach(config['api'], (val, key) => {
  app.set('api:' + key, new API(key, val));
});

// Promise.all([notarizationSDK.deploy(), accessService.deploy()])
//   .then(() => {
//     Promise.all([notarizationSDK.init(), accessService.init()])
//   })
// ;

global['app'] = app;
