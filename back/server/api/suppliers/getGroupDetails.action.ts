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


    loggerT.verbose('Getting group details.');
    loggerT.verbose('req', req.params);
    let params = {}; 
    params = req.params;
    
    return SupplierRegistry.getGroupDetails(req.decoded.organisation, params)
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
