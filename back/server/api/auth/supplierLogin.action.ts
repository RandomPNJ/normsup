import * as _ from 'lodash';
import * as uuid from 'uuid/v4';
import * as moment from 'moment';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '/login',
    services: [''],
    handler: (req, res, app) => login(req.body, res, app.get('SupplierRegistry'), app.get('UsersRegistry')),
};

export function login(body, res, SupplierRegistry, UsersRegistry) {
    const user = body;

    loggerT.info(`Logging in user ${user.username}.`);

    if ((!user.username || !user.password) || (user.username === "" || user.password === "")) {
        const err = new Error(`Invalid login credentials.`);
        err['statusCode'] = 400;
        throw err;
    }

    return SupplierRegistry.login(user.username, user.password)
        .then(result => {
            loggerT.verbose('SupplierRegistry LOGIN RES', result);
            result.type = 'SUPPLIER';
            let tok = UsersRegistry.genToken(result);
            loggerT.verbose('SupplierRegistry LOGIN TOK', tok);
            return SupplierRegistry.supplierLoginHistory(result)
                .then(() => {
                    return res.cookie('supplier', tok, {
                        httpOnly: true,
                        expires: moment().add(1, 'day').toDate()
                    }).send({
                        data: result,
                        msg: 'Success'
                    });
                })
                .catch(err => {
                    loggerT.error('[SUPPLIER LOGIN] SupplierRegistry.supplierLoginHistory error :', err)
                    return res.cookie('supplier', tok, {
                        httpOnly: true,
                        expires: moment().add(1, 'day').toDate()
                    }).send({
                        data: result,
                        msg: 'Success'
                    });
                })
            ;
            
        })
        .catch(err => {
            loggerT.verbose('Final err', err);
            res.status(err.statusCode).json({ data: {}, msg: err.msg });
            return res;
        })
    ;
}
