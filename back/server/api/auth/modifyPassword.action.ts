import * as _ from 'lodash';
import * as uuid from 'uuid/v4';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '/',
    services: [''],
    handler: (req, res, app) => modifyPassword(req.body, res, app.get('AuthRegistry')),
};

export function modifyPassword(body, res, AuthRegistry) {

    
    if(!body || !body.newPassword || !body.oldPassword || !body.type || !body.email) {
        const err = new Error(`Invalid query, body needs to contain following properties: newPassword, oldPassword, type, email.`);
        err['statusCode'] = 400;
        throw err;
    }

    loggerT.verbose('ModifyPassword body === ', body)

    const regexp =  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    loggerT.verbose('reg === ', regexp.test(body.newPassword))
    if(body.newPassword.match(regexp) === null) {
        const err = new Error(`Invalid query, password not conform.`);
        err['statusCode'] = 400;
        throw err;
    }

    loggerT.info(`Modifying password for email ${body.email}.`);

    return AuthRegistry.modifyPassword(body)
        .then(result => {
            return Promise.resolve(result);
        })
        .catch(err => {
            loggerT.verbose('Final err', err);
            res.status(err.statusCode).json(err);
            // return Promise.reject({exists: false});
        })
    ;
}
