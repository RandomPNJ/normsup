import * as _ from 'lodash';
import { AlertSchema }from '../../components/settings/settingsSchema';


declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => manageAlerts(req, res, app.get('SettingsRegistry')),
};

export function manageAlerts(req, res, SettingsRegistry) {
    // if (!req.decoded) {
    //     return Promise.reject(`Cannot get user informations, invalid request.`);
    // }
    let data;
    loggerT.verbose('Updating alert preferences.');

    AlertSchema.validate(req.body, (err, val) => {
        if (err && err.details[0].message) {
            const error = new Error(`Invalid request, error message: ${err.details[0].message}.`);
            error['statusCode'] = 400;
            throw error;
        }
        data = val;
    });

    loggerT.verbose('body == ', data);
    return SettingsRegistry.manageAlerts(data)
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
