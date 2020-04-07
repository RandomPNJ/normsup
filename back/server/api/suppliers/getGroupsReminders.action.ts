import 'reflect-metadata';
import * as _ from 'lodash';
import * as moment from 'moment';
import config from '../../config/environment/index';

declare var loggerT: any;

export default {
    method: 'get',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => getGroupsReminders(req, res, app.get('SupplierRegistry')),
};

export function getGroupsReminders(req, res, SupplierRegistry) {
    if (!req.decoded) {
        return Promise.reject(`Cannot get user informations, invalid request.`);
    }

    loggerT.verbose('Getting the supplier\'s groups\' reminders.');

    if(!req.decoded.organisation) {
        const error = new Error(`Invalid request, organisation must be specified.`);
        error['statusCode'] = 400;
        throw error;
    }
    
    return SupplierRegistry.getGroupsReminders(req.decoded.organisation)
        .then(result => {
            let finalResult = {
                items: result
            };
            return finalResult;
        })
        .catch(err => {
            delete err.stackTrace;
            throw err;
        })
    ;
}
