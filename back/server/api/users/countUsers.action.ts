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
    if(!req.decoded) {
        const error = new Error(`Invalid request, could not get information from token.`);
        error['statusCode'] = 400;
        throw error;
    }

    loggerT.verbose('Counting users for user management.');

    return UsersRegistry.countUsersManagement({}, req.decoded)
        .then(res => {
            return res;
        })
        .catch(err => {
            return err;
        })
    ;

}
