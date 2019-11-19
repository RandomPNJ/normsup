import 'reflect-metadata';
import * as _ from 'lodash';
import * as moment from 'moment';
import config from '../../config/environment/index';

declare var loggerT: any;

export default {
    method: 'get',
    uriPattern: '/api/group/check_availability',
    services: [''],
    handler: (req, res, app) => checkGroup(req, res, app.get('SupplierRegistry')),
};

export function checkGroup(req, res, SupplierRegistry) {
    if (!req.decoded) {
        return Promise.reject(`Cannot get user informations, invalid request.`);
    }


    loggerT.verbose('Checking if group already exists.');
    if(!req.decoded.organisation) {
        const error = new Error(`Invalid request, organisation must be specified.`);
        error['statusCode'] = 400;
        throw error;
    }
    let query = {}; 
    query = req.query;
    
    return SupplierRegistry.checkGroup(req.decoded.organisation, query)
        .then(res => {
            let result = {
                items: res
            };
            return result;
        })
        .catch(err => {
            delete err.stackTrace;
            throw err;
        })
    ;
}
