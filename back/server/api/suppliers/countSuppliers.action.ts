import 'reflect-metadata';
import * as _ from 'lodash';
import config from '../../config/environment/index';

declare var loggerT: any;

export default {
    method: 'get',
    uriPattern: '/count',
    services: [''],
    handler: (req, res, app) => getSuppliers(req, res, app.get('SupplierRegistry')),
};

export function getSuppliers(req, res, SupplierRegistry) {
    if (!req.decoded) {
        return Promise.reject(`Cannot get user informations, invalid request.`);
    }

    return SupplierRegistry.countSuppliers(req.query, req.decoded)
        .then(res => {
            // let result = {
            //     count: res
            // };
            return res;
        })
        .catch(err => {
            delete err.stackTrace;
            throw err;
        })
    ;
}
