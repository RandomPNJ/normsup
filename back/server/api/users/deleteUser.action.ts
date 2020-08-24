import { UserSchema }from '../../components/users/userSchema';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => deleteUser(req, app.get('UsersRegistry')),
};

export function deleteUser(req, UsersRegistry) {
    if(!req.decoded) {
        const error = new Error(`Invalid request, could not get information from token.`);
        error['statusCode'] = 400;
        throw error;
    }

    if(!req.params && !req.params.id) {
        const error = new Error(`Could not get id from query params.`);
        error['statusCode'] = 400;
        throw error;
    }

    loggerT.verbose('Deleting user with id : ', req.params.id);

    return UsersRegistry.deleteUser(req.params.id, req.decoded)
        .then(res => {
            loggerT.verbose('deleteUser res', res);
            let response = {
                statusCode: 200,
                msg: 'User successfully deleted.'
            };

            return response;
        })
        .catch(err => {
            throw err;
        })
    ;

}
