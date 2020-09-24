import * as _ from 'lodash';
import * as uuid from 'uuid/v4';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '/',
    services: [''],
    handler: (req, res, app) => generateActivationLink(req.body, res, app.get('AuthRegistry')),
};

export function generateActivationLink(body, res, AuthRegistry) {

    
    if(!body['email']) {
        const err = new Error(`Email not specified.`);
        err['statusCode'] = 400;
        throw err;
    }
    loggerT.info(`Generation activation link for email ${body.email}.`);

    loggerT.verbose('email = ', body['email']);

    return AuthRegistry.generateActivationLink(body['email'])
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
