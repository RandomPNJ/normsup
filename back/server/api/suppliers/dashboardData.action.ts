import 'reflect-metadata';
import * as _ from 'lodash';
import config from '../../config/environment/index';

declare var loggerT: any;

export default {
    method: 'get',
    uriPattern: '/count',
    services: [''],
    handler: (req, res, app) => getDashboardData(req, res, app.get('SupplierRegistry')),
};

export function getDashboardData(req, res, SupplierRegistry) {
    if (!req.decoded) {
        return Promise.reject(`Cannot get user informations, invalid request.`);
    }

    return SupplierRegistry.getDashboardData(req.query, req.decoded)
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
