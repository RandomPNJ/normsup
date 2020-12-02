import 'reflect-metadata';
import * as _ from 'lodash';
import * as moment from 'moment';
import config from '../../config/environment/index';

declare var loggerT: any;

export default {
    method: 'get',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => getClientList(req, res, app.get('SupplierRegistry')),
};

export function getClientList(req, res, SupplierRegistry) {
    if(!req.decoded) {
        return Promise.reject(`Cannot get user informations, invalid request.`);
    }

    const params = req.query;
    loggerT.verbose('Getting a supplier\'s client list.');

    loggerT.verbose('params = ', params);
    loggerT.verbose('req.params = ', req.params);
    return SupplierRegistry.getClientList(params, req.decoded)
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
