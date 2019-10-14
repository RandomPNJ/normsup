import 'reflect-metadata';
import * as _ from 'lodash';
import * as moment from 'moment';
import config from '../../config/environment/index';

declare var loggerT: any;

export default {
    method: 'get',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => getGroups(req, res, app.get('SupplierRegistry')),
};

export function getGroups(req, res, SupplierRegistry) {
    if (!req.decoded) {
        return Promise.reject(`Cannot get user informations, invalid request.`);
    }


    loggerT.verbose('Getting the supplier\'s groups.');
    if(!req.decoded.organisation) {
        const error = new Error(`Invalid request, organisation must be specified.`);
        error['statusCode'] = 400;
        throw error;
    }

    return SupplierRegistry.getGroups(req.decoded.organisation)
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
