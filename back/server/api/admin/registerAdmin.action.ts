import { UserSchema }from '../../components/users/userSchema';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '/register',
    services: [''],
    handler: (req, res, app) => createAdmin(req, app.get('AdminRegistry')),
};

export function createAdmin(req, AdminRegistry) {
    loggerT.verbose('Body to create Users', req.body);
    let data;

    data = req.body;

    loggerT.verbose('admin createAdmin data', data);
    data.create_time = new Date();
    // this removes white spaces I think
    data.username = data.name.replace(/\s+/g, '') + "_" + data.lastname.replace(/\s+/g, '');;
    data.username = data.username.substring(0, 16);
    // If no password generated, generate one
    if(!data.password) {
        data.password = 'randompassword';
    }

    return bcrypt.hash(data.password, 14, function(err, hash) {
        if(err) {
            const error = new Error(`Could not store the user, please retry.`);
            error['statusCode'] = 400;
            throw error;
        }
        // Store hash in your password DB.
        data.password = hash;
        return AdminRegistry.createAdmin(data, req.decoded)
            .then(res => {
                loggerT.verbose('createAdmin res', res);
                let response = {
                    statusCode: 200,
                    msg: 'User successfully created.'
                };

                return response;
            })
            .catch(err => {
                throw err;
            })
        ;
    });

}
