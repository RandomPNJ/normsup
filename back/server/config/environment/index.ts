import * as _ from 'lodash';


export default {
  appName: 'Roger back',
  env: process.env.NODE_ENV || 'local',
  port: process.env.PORT || 8080,
  ip: process.env.IP || '0.0.0.0',

  // api: {apiName: { url, routes}} // if using API
  secret: 'eZyo2k4p',
  jwt: {
    expirationTime: 86400
  },
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

  s3Params: {
    maxAsyncS3: 20,     // this is the default
    s3RetryCount: 3,    // this is the default
    s3RetryDelay: 1000, // this is the default
    multipartUploadThreshold: 20971520, // this is the default (20 MB)
    multipartUploadSize: 15728640, // this is the default (15 MB)
    s3Options: {
      accessKeyId: 'AKIASFDGPSTARKFFW44O',
      secretAccessKey: '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',
    },
  },

  s3: {
    bucket: 'normsup',
    KBIS: '/KBIS',
    URSSAF: '/URSSAF',
    LNTE: '/LNTE'
  },

  model: {
    users: {
      uri: '/api/users',
      actions: [
        { name: 'createUser', uriPattern: '/register', method: 'post' },
        { name: 'modifyUser', uriPattern: '/modify/:id', method: 'put' },
        { name: 'modifyPassword', uriPattern: '/modify/:id/modify_password', method: 'post' },
        { name: 'deleteUser', uriPattern: '/delete/:id', method: 'post' },
        { name: 'getUsers', uriPattern: '', method: 'get' },
        { name: 'getUser', uriPattern: '/getOne/:id', method: 'get' },
        { name: 'getCurrent', uriPattern: '/current', method: 'get' },
      ],
    },
    suppliers: {
      uri : '/api/supplier',
      actions: [
        { name: 'getSuppliers', uriPattern: '', method: 'get' },
        { name: 'createSupplier', uriPattern: '/define_supplier', method: 'post' },
        { name: 'modifySupplier', uriPattern: '/modify_supplier/:id', method: 'put' },
        { name: 'countSuppliers', uriPattern: '/count', method: 'get' },
        { name: 'getGroups', uriPattern: '/groups', method: 'get' },
        { name: 'getGroupDetails', uriPattern: '/group/:id', method: 'get' },
        { name: 'getGroupMembers', uriPattern: '/group/:id/members', method: 'get' },
        { name: 'checkGroup', uriPattern: '/group/check_availability', method: 'get' },
        { name: 'createGroup', uriPattern: '/define_group', method: 'post' },
        { name: 'deleteGroup', uriPattern: '/group/:id/delete', method: 'post' },
        { name: 'modifyGroupReminders', uriPattern: '/group/:id/modify_reminders', method: 'post' },
        { name: 'modifyGroup', uriPattern: '/group/:id/modify_group', method: 'post' },
      ],
    },
    documents: {
      uri : '/api/documents',
      actions: [
        { name: 'getDocuments', uriPattern: '', method: 'get' },
        { name: 'createDocument', uriPattern: '/upload', method: 'post' }
      ],
    },
    auth: {
      uri: '/api/auth',
      actions: [
        { name: 'login', uriPattern: '/login', method: 'post' },
        { name: 'refreshToken', uriPattern: '/refresh_token', method: 'post' },
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

  queries: {
    // Start SEarch Company Group
    CGSES: 'QUERY_SUPPLIER_OFFLIM_SE_GROUP', 
    CSES: 'QUERY_GET_SUPPLIER_OFFLIM_SEARCH',
    CGS: 'QUERY_GET_SUPPLIER_GROUP',
    CS: 'QUERY_GET_SUPPLIER_OFFLIM',
    CGSE: 'QUERY_GET_SUPPLIER_SEARCH_GRP',
    CSE: 'QUERY_GET_SUPPLIER_SEARCH', 
    CG: 'QUERY_GET_GROUP_SUPPLIERS',
    C: 'QUERY_GET_SUPPLIER',
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
