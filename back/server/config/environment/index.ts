import * as _ from 'lodash';


export default {
  appName: 'Roger back',
  env: process.env.NODE_ENV || 'local',
  port: process.env.PORT || 8080,
  ip: process.env.IP || '0.0.0.0',

  // api: {apiName: { url, routes}} // if using API
  secret: 'eZyo2k4p',
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
    host: 'database.normsup',
    user: 'admin',
    port: '3306',
    password : 'Jesuisla1!',
    database: 'normsup',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: "utf8mb4",
  },
  model: {
    users: {
      uri: '/api/users',
      actions: [
        { name: 'createUser', uriPattern: '/register', method: 'post' },
        { name: 'modifyUser', uriPattern: '/modify/:id', method: 'put' },
        { name: 'deleteUser', uriPattern: '/delete/:id', method: 'post' },
        { name: 'getUsers', uriPattern: '', method: 'get' },
      ],
    },
    suppliers: {
      uri : '/api/supplier',
      actions: [
        { name: 'getSuppliers', uriPattern: '', method: 'get' },
        { name: 'createSupplier', uriPattern: '/define_supplier', method: 'post' },
        { name: 'modifySupplier', uriPattern: '/modify_supplier/:id', method: 'put' },
        { name: 'countSuppliers', uriPattern: '/count', method: 'get' },
      ],
    },
    documents: {
      uri : '/api/documents',
      actions: [
        { name: 'getDocuments', uriPattern: '', method: 'get' },
        // { name: 'createSupplier', uriPattern: '/define_supplier', method: 'post' },
        // { name: 'modifySupplier', uriPattern: '/modify_supplier/:id', method: 'put' },
      ],
    },
    auth: {
      uri: '/api/auth',
      actions: [
        { name: 'login', uriPattern: '/login', method: 'post' },
      ]
    },
    settings: {
      uri: '/api/settings',
      actions: [
        { name: 'manageAlerts', uriPattern: '/alerts/manage', method: 'post' },
        { name: 'getAlerts', uriPattern: '/alerts/:id', method: 'get' },
        { name: 'manageReminders', uriPattern: '/reminders/manage', method: 'post' },
        { name: 'getReminders', uriPattern: '/reminders/:id', method: 'get' },
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
    settings: {
      db: 'db:sqlDB',
      aliases: ['setting', 'settings'],
    },
  }, // if using a DB
  AUTOSTART: _.isBoolean(process.env.AUTOSTART) ? process.env.AUTOSTART : true,
  SELF_SIGNED_SSL: process.env.SELF_SIGNED_SSL ? isTrue(process.env.SELF_SIGNED_SSL) : true,
};

export function isTrue(toEvaluate) {
  return toEvaluate && toEvaluate === true;
}
