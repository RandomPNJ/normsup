import * as _ from 'lodash';


export default {
  appName: 'Normsup Server',
  env: process.env.NODE_ENV || 'local',
  port: process.env.PORT || 8080,
  timezone: process.env.TZ || 'Europe/Paris',
  ip: process.env.IP || '0.0.0.0',
  momentLocale: 'fr',

  // api: {apiName: { url, routes}} // if using API
  secret: 'eZyo2k4p',
  jwt: {
    // expirationTime: 86400
    expirationTime: '180d'
  },
  supplierJWT: {
    expirationTime: 14400
  },
  LOG_DIR: process.env.LOG_DIR || 'logs',

  mailconfig: {
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    // service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: 'mail.normsup@gmail.com',
      pass: 'Panda78!'
    }
  },

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

  awsconfig: {
    region: 'eu-west-1',
    accessKeyId: 'AKIASFDGPSTATLP53JNR',
    secretAccessKey: '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',
  },
  s3Params: {
    maxAsyncS3: 20,     // this is the default
    s3RetryCount: 3,    // this is the default
    s3RetryDelay: 1000, // this is the default
    multipartUploadThreshold: 20971520, // this is the default (20 MB)
    multipartUploadSize: 15728640, // this is the default (15 MB)
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
        { name: 'modifyUserRole', uriPattern: '/modify/:id/role', method: 'put' },
        { name: 'modifyPassword', uriPattern: '/modify/:id/modify_password', method: 'post' },
        { name: 'uploadPicture', uriPattern: '/upload', method: 'post' },
        { name: 'getPicture', uriPattern: '/picture', method: 'get' },
        { name: 'deleteUser', uriPattern: '/delete/:id', method: 'post' },
        { name: 'getUsers', uriPattern: '', method: 'get' },
        { name: 'countUsers', uriPattern: '/count', method: 'get' },
        { name: 'getUser', uriPattern: '/getOne/:id', method: 'get' },
        { name: 'getCurrent', uriPattern: '/current', method: 'get' },
        { name: 'getUsersManagement', uriPattern: '/management', method: 'get' },
      ],
    },
    suppliers: {
      uri : '/api/suppliers',
      actions: [
        { name: 'checkSupplier', uriPattern: '/available', method: 'get' },
        { name: 'getSuppliers', uriPattern: '', method: 'get' },
        { name: 'getCurrentSupplier', uriPattern: '/currentSupplier', method: 'get' },
        { name: 'createSupplier', uriPattern: '/define_supplier', method: 'post' },
        { name: 'createSupplierUser', uriPattern: '/define_supplier_user', method: 'post' },
        { name: 'createRepresentative', uriPattern: '/define_representative', method: 'post' },
        { name: 'modifySupplier', uriPattern: '/modify_supplier/:id', method: 'put' },
        { name: 'countSuppliers', uriPattern: '/count', method: 'get' },
        { name: 'dashboardData', uriPattern: '/dash', method: 'get' },
        { name: 'deleteSupplier', uriPattern: '/delete/:id', method: 'post' },
        { name: 'getGroups', uriPattern: '/groups', method: 'get' },
        { name: 'getGroupDetails', uriPattern: '/group/:id', method: 'get' },
        { name: 'getGroupMembers', uriPattern: '/group/:id/members', method: 'get' },
        { name: 'getGroupsReminders', uriPattern: '/groups/reminders', method: 'get' },
        { name: 'checkGroup', uriPattern: '/group/check_availability', method: 'get' },
        { name: 'createGroup', uriPattern: '/define_group', method: 'post' },
        { name: 'deleteGroup', uriPattern: '/group/:id/delete', method: 'post' },
        { name: 'deleteRepresentative', uriPattern: '/representatives/:id/delete', method: 'delete' },
        { name: 'modifyGroupReminders', uriPattern: '/group/:id/modify_reminders', method: 'post' },
        { name: 'modifyGroup', uriPattern: '/group/:id/modify_group', method: 'post' },
        { name: 'modifyRepresentative', uriPattern: '/modify_representative/:id', method: 'post' },
        { name: 'conformityPerMonth', uriPattern: '/monthly_conformity', method: 'get' },
      ],
    },
    supplier: {
      uri : '/api/supplier',
      actions: [
        { name: 'getCurrentSupplier', uriPattern: '/currentSupplier', method: 'get' },
        { name: 'getDocuments', uriPattern: '/documents', method: 'get' },
        { name: 'getDocumentList', uriPattern: '/document_list', method: 'get' },
        { name: 'getClientList', uriPattern: '/client_list', method: 'get' },
        { name: 'getActiveDocDetails', uriPattern: '/document/active', method: 'get' },
      ],
    },
    reminders: {
      uri : '/api/reminders',
      actions: [
        { name: 'sendReminder', uriPattern: '/supplier/:id', method: 'post' },
        { name: 'sendGroupReminder', uriPattern: '/group/:id', method: 'post' },
        { name: 'dailyReminders', uriPattern: '/daily', method: 'post' },
      ],
    },
    documents: {
      uri : '/api/documents',
      actions: [
        { name: 'getDocuments', uriPattern: '', method: 'get' },
        { name: 'downloadDocument', uriPattern: '/download/:id', method: 'get' },
        { name: 'createDocument', uriPattern: '/upload', method: 'post' },
        { name: 'exportDocuments', uriPattern: '/export', method: 'get' },
      ],
    },
    auth: {
      uri: '/api/auth',
      actions: [
        { name: 'login', uriPattern: '/login', method: 'post' },
        { name: 'resetPassword', uriPattern: '/reset_password', method: 'post' },
        { name: 'modifyResetPassword', uriPattern: '/reset_password/modify', method: 'post' },
        { name: 'activateAccount', uriPattern: '/activate', method: 'post' },
        { name: 'generateActivationLink', uriPattern: '/generate_activation_link', method: 'post' },
        { name: 'modifyPassword', uriPattern: '/modify_password/:id', method: 'post' },
        { name: 'refreshToken', uriPattern: '/refresh_token', method: 'post' },
        { name: 'supplierLogin', uriPattern: '/supplier-login', method: 'post' },
        { name: 'supplierResetPassword', uriPattern: '/supplier_reset_password', method: 'post' },
        { name: 'modifyResetPwdSupplier', uriPattern: '/supplier_reset_password/modify', method: 'post' },
        { name: 'logout', uriPattern: '/logout', method: 'post' },
        { name: 'adminLogin', uriPattern: '/admin/login', method: 'post' },
        { name: 'adminLogout', uriPattern: '/admin/logout', method: 'post' },
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
    },
    admin: {
      uri: '/api/admin',
      actions: [
        { name: 'getUsers', uriPattern: '/users', method: 'get' },
        { name: 'getDocuments', uriPattern: '/documents', method: 'get' },
        { name: 'getClients', uriPattern: '/clients', method: 'get' },
        { name: 'getSuppliers', uriPattern: '/suppliers', method: 'get' },
        { name: 'getSuppliersUsers', uriPattern: '/suppliers/users', method: 'get' },
        { name: 'registerUser', uriPattern: '/users/register', method: 'post' },
        { name: 'registerClient', uriPattern: '/clients/register', method: 'post' },
        { name: 'registerAdmin', uriPattern: '/register', method: 'post' },
        { name: 'createSupplierUser', uriPattern: '/suppliers/register', method: 'post' },
        { name: 'dailyReminders', uriPattern: '/daily_reminders', method: 'post' },
        { name: 'monthlyConformity', uriPattern: '/monthly_conformity', method: 'post' },
        { name: 'getCurrent', uriPattern: '/current', method: 'get' },
        { name: 'conformityCheckup', uriPattern: '/conformity/checkup', method: 'post' },
        { name: 'dailyAlerts', uriPattern: '/alerts', method: 'post' },
        { name: 'documentValidation', uriPattern: '/documents/validation/:id', method: 'post' },
        { name: 'downloadDocument', uriPattern: '/documents/download/:id', method: 'get' },
      ]
    }
  },

  queries: {
    // Start SEarch Company Group STate
    CST: 'GET_SUPPLIER_STATE',// new
    CGST: '',// new
    CSEST: '',// new
    CSST: '',// new
    CGSEST: '',// new
    CGSESST: '',// new
    CGSST: 'GET_SUPPLIER_OFFLIM_STATE',// new
    CSESST: '',// new
    CGSES: 'QUERY_SUPPLIER_OFFLIM_SE_GROUP',  // nomore
    CSES: 'QUERY_GET_SUPPLIER_OFFLIM_SEARCH', // done
    CG: 'QUERY_GET_SUPPLIER_GROUP', // done
    CS: 'QUERY_GET_SUPPLIER_OFFLIM', // done
    CGSE: 'QUERY_GET_SUPPLIER_SEARCH_GRP', // done
    CSE: 'QUERY_GET_SUPPLIER_OFFLIM_SEARCH',
    C: 'QUERY_GET_SUPPLIER', // done
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
