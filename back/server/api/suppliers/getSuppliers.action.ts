import 'reflect-metadata';
import * as _ from 'lodash';
import * as moment from 'moment';
import config from '../../config/environment/index';

declare var loggerT: any;

export default {
    method: 'get',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => getSuppliers(req, res, app.get('SupplierRegistry')),
};

export function getSuppliers(req, res, SupplierRegistry) {
    if (!req.decoded) {
        return Promise.reject(`Cannot get user informations, invalid request.`);
    }

    const params = req.query;
    loggerT.verbose('Getting the suppliers.', req.decoded);

    if(!params.length) {
        params.length = 10;
    } else {
        params.length = parseInt(params.length, 10);
    }
    let data = {
        company: req.decoded.organisation,
        limit: params.length,
        search: params.search,
        group: params.group,
        state: params.state
    };
    if(params.start || params.start == 0) {
        data['start'] = parseInt(params.start, 10);
    } else if(!params.start) {
        data['start'] = 0;
    }
    loggerT.verbose('params == ', data);
    return SupplierRegistry.getSuppliers(data, req.decoded)
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
