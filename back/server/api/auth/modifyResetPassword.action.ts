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

    
    if(!body || !body.token) {
        const err = new Error(`Invalid query, no token provided.`);
        err['statusCode'] = 400;
        throw err;
    }

    if(!body || !body.password) {
        const err = new Error(`Invalid query, no password provided.`);
        err['statusCode'] = 400;
        throw err;
    } 

    const regexp =  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    loggerT.verbose('reg === ', regexp.test(body.password))
    if(body.password.match(regexp) === null) {
        const err = new Error(`Invalid query, password not conform.`);
        err['statusCode'] = 400;
        throw err;
    }

    loggerT.info(`Resetting password.`);

    return AuthRegistry.resetPasswordModify(body.token, body.password)
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
