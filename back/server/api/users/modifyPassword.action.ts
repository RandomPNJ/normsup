// import { UserSchema } from '../../components/users/userSchema';
// import { cloneDeep } from 'lodash';
// import * as moment from 'moment';

declare var loggerT: any;

export default {
    method: 'get',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => modifyPassword(req, app.get('UsersRegistry'), res),
};

export function modifyPassword(req, UsersRegistry, res) {

    loggerT.verbose('body', req.body)
    if(!req.params.id) {
        const error = new Error(`Invalid request, id must be specified.`);
        error['statusCode'] = 400;
        throw error;
    }
    if(!req.body.password) {
        const error = new Error(`Invalid request, password must not be empty.`);
        error['statusCode'] = 400;
        throw error;
    }
    const id = parseInt(req.params.id, 10);
    const data = req.body;
    return UsersRegistry.modifyPassword(id, req.decoded.email, data)
        .then(res => {
            loggerT.verbose('final res', res);
            let result = {
                items: res
            };
            return result;
        })
        .catch(err => {
            loggerT.error('final err', err);
            res.status(err.statusCode).json({ msg: err.msg });
            return res;
        })
    ;

}
