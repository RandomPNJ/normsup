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

    if ((!user.username || !user.password) || (user.username === "" || user.password === "")) {
        const err = new Error(`Invalid login credentials.`);
        err['statusCode'] = 400;
        throw err;
    }

    return UserRegistry.login(user.username, user.password)
        .then(result => {
            let tok = UserRegistry.genToken(result);
            let refreshUUID = uuid();
            UserRegistry.setRefreshToken(refreshUUID, user.username);
            res.cookie('refresh', refreshUUID, {
                // maxAge: 900000,
                expires: new Date(2147483647000),
                httpOnly: true
            });
            return res.cookie('auth', tok, {
                // maxAge: 900000,
                expires: new Date(2147483647000),
                httpOnly: true
            }).send({
                data: result,
                msg: 'Success'
            });
        })
        .catch(err => {
            loggerT.verbose('Final err', err);
            res.status(err.statusCode).json({ data: {}, msg: err.msg });
            return res;
        })
    ;
}
