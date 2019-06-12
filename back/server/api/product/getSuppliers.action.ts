import 'reflect-metadata';
import * as _ from 'lodash';
import * as moment from 'moment';
import config from '../../config/environment/index';

declare var loggerT: any;

export default {
    method: 'get',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => getSuppliers(req, res, app.get('SupplierRegistry')),
};

export function getSuppliers(req, res, SupplierRegistry) {
    // if (!req.decoded) {
    //     return Promise.reject(`Cannot get user informations, invalid request.`);
    // }

    const params = req.query;
    loggerT.verbose('Getting the suppliers.');

    return SupplierRegistry.getSuppliers();
    // return SupplierRegistry.getSuppliers(params)
    //     .then(res => {
    //         return res;
    //     })
    //     .catch(err => {
    //         delete err.stackTrace;
    //         throw err;
    //     })
    // ;
}
