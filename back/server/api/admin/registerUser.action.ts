import { UserSchema }from '../../components/users/userSchema';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '/register',
    services: [''],
    handler: (req, res, app) => createUser(req, app.get('AdminRegistry')),
};

export function createUser(req, AdminRegistry) {
    loggerT.verbose('Body to create Users', req.body);
    let data;
    const creator = req.decoded;

    UserSchema.validate(req.body.user, (err, val) => {
        if (err && err.details[0].message) {
            const error = new Error(`Invalid request, error message: ${err.details[0].message}.`);
            error['statusCode'] = 400;
            throw error;
        }
        data = _.cloneDeep(val);
    });
    loggerT.verbose('admin createUser data', data);
    data.create_time = new Date();
    // if(!data.organisation && creator.organisation) {
    //     data.client = creator.organisation;
    // }
    // if(creator.username) {
    //     data.createdBy = creator.username;
    // }
    // this removes white spaces I think
    data.username = data.name.replace(/\s+/g, '') + "_" + data.lastname.replace(/\s+/g, '');;

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
        return AdminRegistry.createUser(data, req.decoded)
            .then(res => {
                loggerT.verbose('createUser res', res);
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
