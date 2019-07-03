import * as _ from 'lodash';


export default {
  appName: 'Roger back',
  env: process.env.NODE_ENV || 'local',
  port: process.env.PORT || 8091,
  ip: process.env.IP || '0.0.0.0',

  // api: {apiName: { url, routes}} // if using API

  LOG_DIR: process.env.LOG_DIR || 'logs',

  loggers: {
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

  mysqlParams: {
    host: 'localhost',
    user: 'admin',
    password : 'Jesuisla1!',
    database: 'normsup',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  },
  model: {
    product: {
      uri : '/api/supplier',
      actions: [
        { name: 'getSuppliers', uriPattern: '', method: 'get' },
        { name: 'createSupplier', uriPattern: '/define_supplier', method: 'post' },
        { name: 'modifySupplier', uriPattern: '/modify_supplier/:id', method: 'put' },
      ],
    },
    auth: {
      uri: '/api/auth',
      actions: [
        { name: 'createUser', uriPattern: '/createUser', method: 'post' },
        { name: 'login', uriPattern: '/login', method: 'post' },
      ]
    }
  },


  repositories: {
    product: {
      db: 'db:sqlDB',
      aliases: ['user', 'users'],
    },
    suppliers: {
      db: 'db:sqlDB',
      aliases: ['supplier', 'suppliers'],
    },
  }, // if using a DB
  AUTOSTART: _.isBoolean(process.env.AUTOSTART) ? process.env.AUTOSTART : true,
  SELF_SIGNED_SSL: process.env.SELF_SIGNED_SSL ? isTrue(process.env.SELF_SIGNED_SSL) : true,
};

export function isTrue(toEvaluate) {
  return toEvaluate && toEvaluate === true;
}
