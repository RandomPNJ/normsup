import _ from 'lodash';

import credentials, { isTrue } from './credentials';
import staticConfig from './staticConfig';

export default _.merge(staticConfig, {
  appName: 'appName',
  env: process.env.NODE_ENV || 'local',
  port: process.env.PORT || 4000,
  ip: process.env.IP || '0.0.0.0',

  // couchDB: {uri, db, maxResults}, // if using couchDB
  // sqlDB: {uri, options}, // if using sqlDB
  // redisDB: {uri, options}, // if using redisDB
  // amqp: {uri, options, exchanges}, // if using amqp
  // api: {apiName: { url, routes}} // if using API

  LOG_DIR: process.env.LOG_DIR || 'logs',
  loggers: credentials('loggersConfig.appName') || {
    loggerT: {
      level: 'verbose',
      console: true,
      process: true,
    },
    loggerIO: {
      level: 'verbose',
      console: true,
    },
  },

  AUTOSTART: _.isBoolean(process.env.AUTOSTART) ? process.env.AUTOSTART : true,
  SELF_SIGNED_SSL: process.env.SELF_SIGNED_SSL ? isTrue(process.env.SELF_SIGNED_SSL) : true,
});
