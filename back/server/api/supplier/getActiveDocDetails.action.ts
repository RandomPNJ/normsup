import 'reflect-metadata';
import * as _ from 'lodash';
import * as moment from 'moment';
import config from '../../config/environment/index';

declare var loggerT: any;

export default {
    method: 'get',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => getActiveDocDetails(req, res, app.get('SupplierRegistry')),
};

export function getActiveDocDetails(req, res, SupplierRegistry) {
    if(!req.decoded) {
        return Promise.reject(`Cannot get user informations, invalid request.`);
    }

    const params = req.query;
    loggerT.verbose('Getting a supplier\'s client list.');

    if(!params || !params.doc) {
        const error = new Error(`Invalid request, could not get document type.`);
        error['statusCode'] = 400;
        throw error;
    }

    loggerT.verbose('supplier\'s client list user= ', req.decoded);

    return SupplierRegistry.getActiveDocDetails(params, req.decoded)
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
