/**
 * Mocha mock config
 * 1.1.2
 */

import _ from 'lodash';

import config from './server/config/environment';

import MockLogger from './server/config/loggers/mockLogger';
import ServiceManager from './server/config/serviceManager/serviceManagerMock';
import Repository from './server/config/repositories/repositoryMock';
import API from './server/config/api/apiMock';

config.AUTOSTART = false;

const app = new ServiceManager({ noCheck: true });

// don't show logs while testing
_.forEach(config.loggers, (val, key) => {
  global[key] = new MockLogger();
  app.set('logger:' + key, global[key]);
});

app.set('config', config);

_.forEach(config.repositories, (val, key) => {
  app.set('repository:' + key, new Repository(), {
    aliases: val.aliases,
  });
});

_.forEach(config.api, (val, key) => {
  app.set('api:' + key, new API(key, val));
});

global.app = app;
