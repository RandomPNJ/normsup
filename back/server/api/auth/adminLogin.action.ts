import * as _ from 'lodash';
import * as uuid from 'uuid/v4';
import * as moment from 'moment';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '/login',
    services: [''],
    handler: (req, res, app) => login(req.body, res, app.get('AdminRegistry'), app.get('UsersRegistry')),
};

export function login(body, res, AdminRegistry, UsersRegistry) {
    const user = body;

    loggerT.info(`Logging in user ${user.username}.`);

    if ((!user.username || !user.password) || (user.username === "" || user.password === "")) {
        const err = new Error(`Invalid login credentials.`);
        err['statusCode'] = 400;
        throw err;
    }

    return AdminRegistry.login(user.username, user.password)
        .then(result => {
            loggerT.verbose('AdminRegistry LOGIN RES', result);
            result.type = 'ADMIN';
            let tok = UsersRegistry.genToken(result);
            loggerT.verbose('AdminRegistry LOGIN TOK', tok);
            return res.cookie('admin', tok, {
                httpOnly: true,
                expires: moment().add(1, 'day').toDate()
            }).send({
                data: result,
                msg: 'Success'
            });
            // return AdminRegistry.adminLoginHistory(result)
            //     .then(() => {
            //         return res.cookie('admin', tok, {
            //             httpOnly: true,
            //             expires: moment().add(1, 'day').toDate()
            //         }).send({
            //             data: result,
            //             msg: 'Success'
            //         });
            //     })
            //     .catch(err => {
            //         return res.cookie('admin', tok, {
            //             httpOnly: true,
            //             expires: moment().add(1, 'day').toDate()
            //         }).send({
            //             data: result,
            //             msg: 'Success'
            //         });
            //     })
            // ;
            
        })
        .catch(err => {
            loggerT.verbose('Final err', err);
            res.status(err.statusCode).json({ data: {}, msg: err.msg });
            return res;
        })
    ;
}
