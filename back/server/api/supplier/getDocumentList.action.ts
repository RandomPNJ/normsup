import 'reflect-metadata';
import * as _ from 'lodash';
import * as moment from 'moment';
import config from '../../config/environment/index';

declare var loggerT: any;

export default {
    method: 'get',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => getDocumentList(req, res, app.get('SupplierRegistry')),
};

export function getDocumentList(req, res, SupplierRegistry) {
    if(!req.decoded) {
        return Promise.reject(`Cannot get user informations, invalid request.`);
    }

    const params = req.query;
    loggerT.verbose('Getting a supplier\'s document list.');
    if(!params.type) {
        const error = new Error(`Invalid request, could not get document type.`);
        error['statusCode'] = 400;
        throw error;
    }

    params.type = params.type.toUpperCase();
    loggerT.verbose('params = ', params);
    return SupplierRegistry.getDocumentList(params, req.decoded)
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
