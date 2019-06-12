import * as _ from 'lodash';


export default {
  appName: 'Roger back',
  env: process.env.NODE_ENV || 'local',
  port: process.env.PORT || 8080,
  ip: process.env.IP || '0.0.0.0',

  // couchDB: {uri, db, maxResults}, // if using couchDB
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

  genericConfig: {
    csr: {
        CsrTypes: ['S', 'R', 'SR', 'NONE'],
        CsrCategory: ['PROCESS', 'PRODUCT'],
    },
    accessControl: {
      getProductsParams: {
        Renault: ['dapji', 'partNumberR'],
        Faurecia: ['partNumberF', 'partNumberR'],
      }
    },
    /* We get the chaincode function name by
     * concatenation of the query params initials in asc order
     * ex : Dapji with dateStart and dateEnd => D_DE_DS
    **/
    chaincodeFn: {
      createProd: 'createProduct',
      createProdBulk: 'createProductBulk',
      createCsr: 'createCsr',
      createCsrBulk: 'createCsrBulk',
      createCar: 'createCar',
      createCarBulk: 'createCarBulk',
      validateProduct: 'validateProduct',
      unvalidateProduct: 'unvalidateProduct',
      addDataToProduct: 'addDataToProduct',
      addDataToCar: 'addDataToCar',

      // Recherche simple
      D: 'queryByDapji',
      PNR: 'queryByPartNumberR',
      PNF: 'queryByPartNumberF',
      DS: 'queryByDatetime',
      DE_DS: 'queryByDatetime',
      FAC: 'queryBySupplierPlantName',
      IDN: 'queryByIDNum',
      ST: 'queryByStatus',

      // Recherche multiple
      D_DE_DS: 'queryByDapji',
      D_DS: 'queryByDapji',
      D_FAC: 'queryByDapji',
      D_DE_DS_FAC: 'queryByDapji',
      D_DS_FAC: 'queryByDapji',
      DE_DS_FAC: 'queryByDatetime',
      DE_DS_IDN: '',

      // Renault
      DE_DS_PNR: 'queryByPartNumberR',
      FAC_PNR: 'queryByPartNumberR',
      DE_DS_FAC_PNR: 'queryByPartNumberR',
      DE_DS_FAC_IDN: '',

      // Faurecia
      DE_DS_PNF: 'queryByPartNumberF',
      FAC_PNF: 'queryByPartNumberF',
      DE_DS_FAC_PNF: 'queryByPartNumberF',
    }

  },


  // repositories: {
  //   product: {
  //     db: 'db:sqlDB',
  //     aliases: ['product', 'products'],
  //   },
  //   requirement: {
  //     db: 'db:sqlDB',
  //     aliases: ['requirement', 'requirements'],
  //   },
  // }, // if using a DB
  AUTOSTART: _.isBoolean(process.env.AUTOSTART) ? process.env.AUTOSTART : true,
  SELF_SIGNED_SSL: process.env.SELF_SIGNED_SSL ? isTrue(process.env.SELF_SIGNED_SSL) : true,
};

export function isTrue(toEvaluate) {
  return toEvaluate && toEvaluate === true;
}
