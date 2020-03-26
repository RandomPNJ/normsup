import 'reflect-metadata';
import * as _ from 'lodash';
import * as moment from 'moment';
import config from '../../config/environment/index';

declare var loggerT: any;

export default {
    method: 'get',
    uriPattern: '/api/group/check_availability',
    services: [''],
    handler: (req, res, app) => checkSupplier(req, res, app.get('SupplierRegistry')),
};

export function checkSupplier(req, res, SupplierRegistry) {
    if (!req.decoded) {
        return Promise.reject(`Cannot get user informations, invalid request.`);
    }


    loggerT.verbose('Checking if supplier already exists.');

    if(!req.decoded.organisation) {
        const error = new Error(`Invalid request, organisation must be specified.`);
        error['statusCode'] = 400;
        throw error;
    }
    if(!req.query.siret) {
        const error = new Error(`Invalid request, siret must be specified.`);
        error['statusCode'] = 400;
        throw error;
    }
    
    return SupplierRegistry.checkSupplier(req.decoded, req.query)
        .then(res => {
            let result = {
                items: res
            };
            return res;
        })
        .catch(err => {
            delete err.stackTrace;
            throw err;
        })
    ;
}
