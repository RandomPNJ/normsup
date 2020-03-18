import { SupplierUserSchema }from '../../components/users/userSchema';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import * as moment from 'moment';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '/register',
    services: [''],
    handler: (req, res, app) => createSupplierUser(req, app.get('SupplierRegistry')),
};

export function createSupplierUser(req, SuppliersRegistry) {
    loggerT.verbose('Body to create Users', req.body);
    let data;
    if(req.body['user']) {
        data = req.body['user']
    }
    const creator = req.decoded;
    if(isNaN(data.validity)) {
        const error = new Error(`Validity is not a valid number, please retry.`);
            error['statusCode'] = 400;
            throw error;
    }
    data.validity = parseInt(data.validity);
    data.created_at = new Date();
    data.validity_date = moment().add(data.validity, 'days').toDate();
    delete data.validity;

    // this removes white spaces I think
    // data.username = data.name.replace(/\s+/g, '') + "_" + data.lastname.replace(/\s+/g, '');
    // data.username = data.username.substring(0, 16);

    data.password = Math.random().toString(36).slice(-8);
    loggerT.verbose('User', data);

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
