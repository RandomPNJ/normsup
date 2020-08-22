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
    
    

    if(!req.body || !req.body.user) {
        const err = new Error(`User data missing in body.`);
        err['statusCode'] = 400;
        throw err;
    }
    if(!req.body.client) {
        const err = new Error(`Client data missing in body.`);
        err['statusCode'] = 400;
        throw err;
    }
    if(!req.body.supplier) {
        const err = new Error(`Supplier data missing in body.`);
        err['statusCode'] = 400;
        throw err;
    }

    const creator = req.decoded;
    let data = req.body.user;
    let supplier = req.body.supplier;
    let client = req.body.client;

    if(isNaN(data.validity)) {
        const error = new Error(`Validity is not a valid number, please retry.`);
        error['statusCode'] = 400;
        throw error;
    }

    data.validity = parseInt(data.validity);
    data.created_at = new Date();
    data.validity_date = moment().add(data.validity, 'days').toDate();
    delete data.validity;

    if(!data.password) {
        data.password = Math.random().toString(36).slice(-8);
    }
    let orgPwd = data.password;
    // data.password = 'supplierpassword';
    loggerT.verbose('User', data);

    return bcrypt.hash(data.password, 14, function(err, hash) {
        if(err) {
            const error = new Error(`Could not store the user, please retry.`);
            error['statusCode'] = 400;
            throw error;
        }
        // Store hash in your password DB.
        data.password = hash;
        return SuppliersRegistry.createSupplierUser(data, req.decoded, client, supplier, orgPwd)
            .then(res => {
                loggerT.verbose('createSupplierUser res', res);
                let response = {
                    statusCode: 200,
                    msg: 'User successfully created.',
                    password: data.password
                };

                return response;
            })
            .catch(err => {
                throw err;
            })
        ;
    });

}
