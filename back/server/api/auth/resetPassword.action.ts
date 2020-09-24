import * as _ from 'lodash';
import * as uuid from 'uuid/v4';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '/login',
    services: [''],
    handler: (req, res, app) => login(req.body, res, app.get('AuthRegistry')),
};

export function login(body, res, AuthRegistry) {

    
    if(!body || !body.email) {
        const err = new Error(`Invalid query, no email provided.`);
        err['statusCode'] = 400;
        throw err;
    }

    loggerT.info(`Resetting password for email : ${body.email}.`);

    return AuthRegistry.resetPassword(body.email)
        .then(result => {
            return Promise.resolve(result);
        })
        .catch(err => {
            loggerT.verbose('Final err', err);
            // res.status(err.statusCode).json({ data: {}, msg: err.msg });
            return Promise.reject({exists: false});
        })
    ;
}
