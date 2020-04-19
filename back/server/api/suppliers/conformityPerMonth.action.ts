import 'reflect-metadata';
import * as _ from 'lodash';
import config from '../../config/environment/index';

declare var loggerT: any;

export default {
    method: 'get',
    uriPattern: '/count',
    services: [''],
    handler: (req, res, app) => monthlyConformity(req, res, app.get('SupplierRegistry')),
};

export function monthlyConformity(req, res, SupplierRegistry) {
    if (!req.decoded) {
        return Promise.reject(`Cannot get user informations, invalid request.`);
    }

    return SupplierRegistry.monthlyConformity(req.query, req.decoded)
        .then(res => {
            // let result = {
            //     total: res.totalConnected,
            //     data: res.data
            // };
            return res;
        })
        .catch(err => {
            delete err.stackTrace;
            throw err;
        })
    ;
}
