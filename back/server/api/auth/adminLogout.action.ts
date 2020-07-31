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

    loggerT.info(`Logging out admin.`);

    if(req.cookies) {
        if(req.cookies.refresh) {
            UserRegistry.deleteRefreshToken(req.cookies.refresh);
            let i = 0;
            let a = true;
            while(req.cookies.refresh && a) {
                res.clearCookie('refresh');
                i++;
                if(i === 3)
                    a = false;
            }
        }
        if(req.cookies.auth) {
            let i = 0;
            let a = true;
            while(req.cookies.auth && a) {
                res.clearCookie('auth');
                i++;
                if(i === 3)
                    a = false;
            }
        }
        if(req.cookies.admin) {
            let i = 0;
            let a = true;
            while(req.cookies.admin && a) {
                res.clearCookie('admin');
                i++;
                if(i === 3)
                    a = false;
            }
        }
    }

    return res.status(200).json({
        msg: 'User has been logged out.'
    });
}
