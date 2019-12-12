import 'reflect-metadata';
import * as _ from 'lodash';
import * as moment from 'moment';
import config from '../../config/environment/index';

declare var loggerT: any;

export default {
    method: 'get',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => getGroupMembers(req, res, app.get('SupplierRegistry')),
};

export function getGroupMembers(req, res, SupplierRegistry) {
    if (!req.decoded) {
        return Promise.reject(`Cannot get user informations, invalid request.`);
    }

    if(!req.params || !req.params.id) {
        const error = new Error(`Invalid request, error message: no id provided.`);
        error['statusCode'] = 400;
        throw error;
    }
    loggerT.verbose('decoded', req.decoded)
    let id = req.params.id;
    loggerT.verbose('Getting group details for group with id :', id);
    
    return SupplierRegistry.getGroupMembers(id, req.decoded.organisation)
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
