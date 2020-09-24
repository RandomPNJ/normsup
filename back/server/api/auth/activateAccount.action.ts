import * as _ from 'lodash';
import * as uuid from 'uuid/v4';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '/',
    services: [''],
    handler: (req, res, app) => activateAccount(req.body, res, app.get('AuthRegistry')),
};

export function activateAccount(body, res, AuthRegistry) {

    loggerT.info(`Activating account.`);

    if(!body['activationToken']) {
        const err = new Error(`Activation token not specified.`);
        err['statusCode'] = 400;
        throw err;
    }


    return AuthRegistry.activateAccount(body['activationToken'])
        .then(result => {
            if(result) {
                return Promise.resolve({msg: 'Account activated.', code: 0})
            }
        })
        .catch(err => {
            loggerT.verbose('Final err', err);
            let e = { data: {}, msg: err.msg };
            /**
             * Codes
             * 0 => Success
             * 1 => Already validated
             * 2 => Expiration time already passed
             * 3 => Token invalid
             */
            if(err.code) {
                e['code'] = err.code;
            }
            res.status(err.statusCode).json(e);
            return res;
        })
    ;
}
