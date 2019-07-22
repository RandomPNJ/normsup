import { SupplierSchema }from '../../components/supplier/supplierSchema';
import { trim, replace } from 'lodash';
import * as moment from 'moment';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '/define_supplier',
    services: [''],
    handler: (req, res, app) => createSupplier(req, app.get('SupplierRegistry')),
};

export function createSupplier(req, SupplierRegistry) {
    let data;

    SupplierSchema.validate(req.body, (err, val) => {
        if (err && err.details[0].message) {
            const error = new Error(`Invalid request, error message: ${err.details[0].message}.`);
            error['statusCode'] = 400;
            throw error;
        }
        data = val;
    });

    if(data.dateCreation) {
        data.dateCreation = new Date(data.dateCreation);
    }
    return SupplierRegistry.createSupplier(data)
        .then(res => {
            return res;
        })
        .catch(err => {
            return err;
        })
    ;

}
