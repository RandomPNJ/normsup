import { UserSchema }from '../../components/users/userSchema';
import { trim, replace } from 'lodash';
import * as moment from 'moment';

declare var loggerT: any;

export default {
    method: 'get',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => getUsersManagement(req, app.get('UsersRegistry')),
};

export function getUsersManagement(req, UsersRegistry) {

    const params = req.params;


    params.org = req.decoded.organisation;
    if(!params.org) {
        const error = new Error(`Invalid request, org must be specified.`);
        error['statusCode'] = 400;
        throw error;
    }

    return UsersRegistry.getUsersManagement(params, req.decoded)
        .then(res => {
            let result = {
                items: res
            };
            return result;
        })
        .catch(err => {
            return err;
        })
    ;

}
