import * as _ from 'lodash';
import * as uuid from 'uuid/v4';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '/login',
    services: [''],
    handler: (req, res, app) => logout(req, res, app.get('UsersRegistry')),
};

export function logout(req, res, UserRegistry) {

    loggerT.info(`Logging out user.`);

    if(req.cookies && req.cookies.refresh) {
        if(req.cookies.refresh) {
            UserRegistry.deleteRefreshToken(req.cookies.refresh);
            res.clearCookie('refresh');
        }
        if(req.cookies.auth) {
            res.clearCookie('auth');
        }
        if(req.cookies.admin) {
            res.clearCookie('admin');
        }
    }

    return res.status(200).json({
        msg: 'User has been logged out.'
    });
}
