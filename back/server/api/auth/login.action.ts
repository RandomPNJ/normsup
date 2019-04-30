import * as _ from 'lodash';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => login(req.body, app.get('AccessService')),
};

export function login(body, AccessService) {
    loggerT.info(`Logging in user ${body.userName}.`);

    if ((!body.userName || !body.password) || (body.userName === "" || body.password === "")) {
        const err = new Error(`Invalid login credentials.`);
        err['statusCode'] = 400;
        throw err;
    }

    const userName = _.upperFirst(_.toLower(body.userName));

    return AccessService.getUserByName(userName, process.env.WEB_APP_ACCESS_ADMIN)
        .then(res => {
            if (res.rc && res.rc === -1 ) {
                throw new Error(`Error when getting user.`);
            }
            const user = res.attachedObj;
            if (AccessService.validPassword(user, body.password)) {
                const token = AccessService.generateToken(user);
                const returnedUser = {
                    userName: user.userName,
                    userFirstName: user.userFirstName,
                    userEmail: user.userEmail,
                    company: user.company,
                    organizationUnit: user.organizationUnit,
                    roles: user.roles
                };
                return {
                    token: token.attachedObj,
                    user: returnedUser
                };
            } else {
                return Promise.reject('Wrong password.');
            }

        })
        .catch(err => {
            return Promise.reject('Wrong credentials.');
        })
    ;
}
