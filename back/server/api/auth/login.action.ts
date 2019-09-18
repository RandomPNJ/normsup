import * as _ from 'lodash';

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
            return res.status(200).json({
                data: result,
                token: tok,
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
