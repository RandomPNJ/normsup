import { UserSchema }from '../../components/users/userSchema';
import { trim, replace } from 'lodash';
import * as moment from 'moment';

declare var loggerT: any;

export default {
    method: 'get',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => getUser(req, app.get('UsersRegistry')),
};

export function getUser(req, UsersRegistry) {
    let id = req.query.id;

    if(!id) {
        const error = new Error(`Invalid request, id must be specified.`);
        error['statusCode'] = 400;
        throw error;
    }

    return UsersRegistry.getUser(id)
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
