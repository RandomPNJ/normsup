import * as _ from 'lodash';
import * as uuid from 'uuid/v4';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '/login',
    services: [''],
    handler: (req, res, app) => login(req.body, res, app.get('UsersRegistry')),
};

export function login(body, res, UserRegistry) {
    const user = body;

    loggerT.info(`Logging in user ${user.username}.`);

    if((!user.username || !user.password) || (user.username === "" || user.password === "")) {
        const err = new Error(`Invalid login credentials.`);
        err['statusCode'] = 400;
        throw err;
    }

    if(!user.stayConnected) {
        user.stayConnected = false;
    }

    return UserRegistry.login(user.username, user.password)
        .then(result => {
            result.type = 'USER';
            let tok = UserRegistry.genToken(result);
            let refreshUUID = uuid();
            UserRegistry.setRefreshToken(refreshUUID, user.username);
            if(user.stayConnected) {
                res.cookie('refresh', refreshUUID, {
                    httpOnly: true
                });
                return res.cookie('auth', tok, {
                    httpOnly: true
                }).send({
                    data: result,
                    msg: 'Success'
                });
            } else {
                res.cookie('refresh', refreshUUID, {
                    expires: new Date(2147483647000),
                    httpOnly: true
                });
                return res.cookie('auth', tok, {
                    expires: new Date(2147483647000),
                    httpOnly: true
                }).send({
                    data: result,
                    msg: 'Success'
                });
            }
        })
        .catch(err => {
            loggerT.verbose('Final err', err);
            /**
             * Login error codes :
             * 0 ====> 
             * 1 ====> 
             * 2 ====> Account has not been activated by the user
             */
            let e = { data: {}, msg: err.msg };
            if(err.code) {
                e['code'] = err.code;
            }
            res.status(err.statusCode).json(e);
            return res;
        })
    ;
}
