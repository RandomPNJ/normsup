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
    
    const params = req.query;
    if(!params) {
        const error = new Error(`Invalid request, org must be specified.`);
        error['statusCode'] = 400;
        throw error;
    }
    loggerT.verbose('Getting users for user management.');

    params.org = req.decoded.organisation;
    if(!params.org) {
        const error = new Error(`Invalid request, org must be specified.`);
        error['statusCode'] = 400;
        throw error;
    }
    if(!params.length) {
        params.length = 10;
    } else {
        params.length = parseInt(params.length, 10);
    }
    if(params.start || params.start == 0) {
        params['start'] = parseInt(params.start, 10);
    } else if(!params.start) {
        params['start'] = 0;
    }
    loggerT.verbose('Getting users for user management params :', params);

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
