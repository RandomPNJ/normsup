import { UserSchema }from '../../components/users/userSchema';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '/register',
    services: [''],
    handler: (req, res, app) => createUser(req, app.get('UsersRegistry')),
};

export function createUser(req, UsersRegistry) {

    let data;
    const creator = req.body.creator;

    UserSchema.validate(req.body.user, (err, val) => {
        if (err && err.details[0].message) {
            const error = new Error(`Invalid request, error message: ${err.details[0].message}.`);
            error['statusCode'] = 400;
            throw error;
        }
        data = _.cloneDeep(val);
    });

    data.create_time = new Date();
    if(creator.organisation) {
        data.main_org = creator.organisation;
    }
    if(creator.username) {
        data.createdBy = creator.username;
    }
    data.username = data.name.replace(/\s+/g, '') + "_" + data.lastname.replace(/\s+/g, '');;


    return bcrypt.hash(data.password, 14, function(err, hash) {
        if(err) {
            const error = new Error(`Could not store the user, please retry.`);
            error['statusCode'] = 400;
            throw error;
        }
        // Store hash in your password DB.
        data.password = hash;
        return UsersRegistry.createUser(data)
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
