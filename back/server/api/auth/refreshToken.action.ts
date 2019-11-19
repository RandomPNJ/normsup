import * as _ from 'lodash';
import * as uuid from 'uuid/v4';
declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '/refresh_token',
    services: [''],
    handler: (req, res, app) => getNewRefreshToken(req.body, res, app.get('UsersRegistry'), app.get('refreshTokens')),
};

export function getNewRefreshToken(body, res, UserRegistry, refreshTok) {

    loggerT.info(`Refreshing token.`);

    if(!body.refreshToken || (body.refreshToken && refreshTok[body.refreshToken] !== undefined)) {
        const err = new Error(`No refresh token provided.`);
        err['statusCode'] = 400;
        throw err;
    }

    loggerT.verbose('refreshTokens = ', UserRegistry.getAllRefreshTokens());
    let username = UserRegistry.getUsernameFromRefreshTok(body.refreshToken);
    loggerT.verbose('username =', username);

    return UserRegistry.refreshToken(username)
        .then(result => {
            let tok = UserRegistry.genToken(result);
            UserRegistry.deleteRefreshToken(body.refreshToken);
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
