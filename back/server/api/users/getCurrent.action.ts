import { UserSchema }from '../../components/users/userSchema';
import { trim, replace } from 'lodash';
import * as moment from 'moment';

declare var loggerT: any;

export default {
    method: 'get',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => getCurrentUser(req, app.get('UsersRegistry')),
};

export function getCurrentUser(req, UsersRegistry) {

    loggerT.verbose('Req decoded ', req.decoded);
    if(!req.decoded) {
        const error = new Error(`Invalid request, could not get information from token.`);
        error['statusCode'] = 400;
        throw error;
    }

    return UsersRegistry.getUser(req.decoded.id)
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
