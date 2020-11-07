import * as _ from 'lodash';
import * as uuid from 'uuid/v4';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '/',
    services: [''],
    handler: (req, res, app) => supplierResetPassword(req.body, res, app.get('AuthRegistry')),
};

export function supplierResetPassword(body, res, AuthRegistry) {

    
    if(!body || !body.email) {
        const err = new Error(`Invalid query, no email provided.`);
        err['statusCode'] = 400;
        throw err;
    }

    loggerT.info(`Resetting password for email : ${body.email}.`);

    return AuthRegistry.supplierResetPassword(body.email)
        .then(result => {
            return Promise.resolve(result);
        })
        .catch(err => {
            loggerT.verbose('Final err', err);
            // res.status(err.statusCode).json({ data: {}, msg: err.msg });
            if(err && err.msg) {
                return Promise.reject(err);
            } else {
                return Promise.reject({exists: false});
            }
        })
    ;
}
