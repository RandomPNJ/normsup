// import { UserSchema } from '../../components/users/userSchema';
// import { cloneDeep } from 'lodash';
// import * as moment from 'moment';

declare var loggerT: any;

export default {
    method: 'get',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => modifyUser(req, app.get('UsersRegistry')),
};

export function modifyUser(req, UsersRegistry) {


    if(!req.params.id) {
        const error = new Error(`Invalid request, id must be specified.`);
        error['statusCode'] = 400;
        throw error;
    }
    const id = parseInt(req.params.id, 10);
    const data = req.body;

    return UsersRegistry.modifyUserRole(id, data)
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
