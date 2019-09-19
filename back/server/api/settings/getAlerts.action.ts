import 'reflect-metadata';
import * as _ from 'lodash';
import * as moment from 'moment';
import config from '../../config/environment/index';

declare var loggerT: any;

export default {
    method: 'get',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => getAlerts(req, res, app.get('SettingsRegistry')),
};

export function getAlerts(req, res, SettingsRegistry) {
    // if (!req.decoded) {
    //     return Promise.reject(`Cannot get user informations, invalid request.`);
    // }
    const params = req.params;
    loggerT.verbose('Getting the client\'s alerts settings.');
    if(!params.id) {
        const error = new Error(`Invalid request, no id specified.`);
        error['statusCode'] = 400;
        throw error;
    }

    return SettingsRegistry.getAlerts(params.id)
        .then(res => {
            let result = {
                settings: res
            };
            return result;
        })
        .catch(err => {
            delete err.stackTrace;
            throw err;
        })
    ;
}
