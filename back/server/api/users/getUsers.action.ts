import { UserSchema }from '../../components/users/userSchema';
import { trim, replace } from 'lodash';
import * as moment from 'moment';

declare var loggerT: any;

export default {
    method: 'get',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => getUsers(req, app.get('UsersRegistry')),
};

export function getUsers(req, UsersRegistry) {
    let data;
    const params = req.params;
    // Unset this after
    params.org = 'SpaceX';

    if(!params.org) {
        const error = new Error(`Invalid request, org must be specified.`);
        error['statusCode'] = 400;
        throw error;
    }

    return UsersRegistry.getUsers(params)
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
