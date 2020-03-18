import { SupplierUserSchema }from '../../components/users/userSchema';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import * as moment from 'moment';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '/register',
    services: [''],
    handler: (req, res, app) => createSupplierUser(req, app.get('SuppliersRegistry')),
};

export function createSupplierUser(req, SuppliersRegistry) {
    loggerT.verbose('Body to create Users', req.body);
    let data;
    const creator = req.decoded;

    SupplierUserSchema.validate(req.body.user, (err, val) => {
        if (err && err.details[0].message) {
            const error = new Error(`Invalid request, error message: ${err.details[0].message}.`);
            error['statusCode'] = 400;
            throw error;
        }
        data = _.cloneDeep(val);
    });

    data.created_at = new Date();
    data.validity_date = moment().add(7, 'days').toDate();

    if(creator.username) {
        data.createdBy = creator.username;
    }

    // this removes white spaces I think
    data.username = data.name.replace(/\s+/g, '') + "_" + data.lastname.replace(/\s+/g, '');
    data.username = data.username.substring(0, 16);

    // loggerT.verbose('data.username', data.username);

    // If no password generated, generate one
    data.password = Math.random().toString(36).slice(-8);

    return bcrypt.hash(data.password, 14, function(err, hash) {
        if(err) {
            const error = new Error(`Could not store the user, please retry.`);
            error['statusCode'] = 400;
            throw error;
        }
        // Store hash in your password DB.
        data.password = hash;
        return SuppliersRegistry.createSupplierUser(data, req.decoded)
            .then(res => {
                loggerT.verbose('createSupplierUser res', res);
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
