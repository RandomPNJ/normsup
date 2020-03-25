import * as _ from 'lodash';
import * as uuid from 'uuid/v4';
declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '/refresh_token',
    services: [''],
    handler: (req, res, app) => getNewRefreshToken(req, res, app.get('UsersRegistry')),
};

export function getNewRefreshToken(req, res, UserRegistry) {

    loggerT.info(`Refreshing token.`);
    loggerT.verbose('refreshTokens = ', UserRegistry.getAllRefreshTokens());

    let refreshTok = UserRegistry.getAllRefreshTokens();
    if(!req.cookies || !req.cookies.refresh || !refreshTok[req.cookies.refresh]) {
        const err = new Error(`Refresh token invalid.`);
        err['statusCode'] = 400;
        throw err;
    }

    loggerT.verbose('refreshTokens = ', UserRegistry.getAllRefreshTokens());
    let username = UserRegistry.getUsernameFromRefreshTok(req.cookies.refresh);
    loggerT.verbose('username =', username);

    return UserRegistry.refreshToken(username)
        .then(result => {
            let tok = UserRegistry.genToken(result);
            UserRegistry.deleteRefreshToken(req.cookies.refresh);
            let newRefreshToken = uuid();
            UserRegistry.setRefreshToken(newRefreshToken, username)
            return res.status(200).json({
                data: result,
                token: tok,
                refreshToken: newRefreshToken,
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
