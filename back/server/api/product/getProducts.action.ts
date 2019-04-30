import 'reflect-metadata';
import * as _ from 'lodash';
import * as moment from 'moment';
import config from '../../config/environment/index';

declare var loggerT: any;

export default {
    method: 'get',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => getProducts(req, res, app.get('ProductRegistry')),
};

export function getProducts(req, res, ProductRegistry) {
    if (!req.decoded) {
        return Promise.reject(`Cannot get user informations, invalid request.`);
    }
    const user = req.decoded;
    const params = req.query;
    loggerT.verbose('Getting the products.');

    const genericParameters = ['supplierPlantName', 'dateStart', 'dateEnd', 'idNum', 'limit', 'offset', 'status'];
    const specificParameters = config.genericConfig.accessControl.getProductsParams[user.company];
    const parameters = _.union(genericParameters, specificParameters);

    if (params.dateEnd && !params.dateStart) {
        const error = new Error(`Invalid request, need date end with date start.`);
        error['statusCode'] = 400;
        throw error;
    }

    _.forEach(Object.keys(params), value => {
        if (!!_.find(parameters, val => val === value)) {
            return;
        }
        const error = new Error(`Invalid parameter ${value}.`);
        error['statusCode'] = 400;
        throw error;
    });

    if (params.dateStart) {
        params.dateStart = moment(params.dateStart, 'DD-MM-YYYY').unix();
        if (isNaN(params.dateStart)) {
            const error = new Error(`Invalid date format.`);
            error['statusCode'] = 400;
            delete error.stack;
            throw error;
        }
    }
    if (params.dateEnd) {
        params.dateEnd = moment(params.dateEnd, 'DD-MM-YYYY').unix();
        if (isNaN(params.dateEnd)) {
            const error = new Error(`Invalid date format.`);
            error['statusCode'] = 400;
            delete error.stack;
            throw error;
        }
    }
    if(params.csrIDs) {
        _.map(params.csrIDs, (csrID) => {
            csrID = csrID.toUpperCase();
        });
    }
    if(params.dapji) {
        params.dapji = params.dapji.toUpperCase();
        params.dapji = _.trim(params.dapji);
    }
    if(params.idNum) {
        params.idNum = params.idNum.toUpperCase();
        params.idNum = _.trim(params.idNum);
    }
    if(params.supplierPlantName) {
        params.supplierPlantName = params.supplierPlantName.toUpperCase();
        params.supplierPlantName = _.trim(params.supplierPlantName);
    }
    if(params.partNumberR) {
        params.partNumberR = params.partNumberR.toUpperCase();
        params.partNumberR = _.trim(params.partNumberR);
    }
    if(params.partNumberF) {
        params.partNumberF = params.partNumberF.toUpperCase();
        params.partNumberF = _.trim(params.partNumberF);
    }

    params.user = user;

    return ProductRegistry.getProducts(params)
        .then(res => {
            return res;
        })
        .catch(err => {
            delete err.stackTrace;
            throw err;
        })
    ;
}
