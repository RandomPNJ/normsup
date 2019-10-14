import { SupplierSchema }from '../../components/supplier/supplierSchema';
import { trim, replace } from 'lodash';
import * as moment from 'moment';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '/define_supplier',
    services: [''],
    handler: (req, res, app) => createSupplier(req, res, app.get('SupplierRegistry')),
};

export function createSupplier(req, res, SupplierRegistry) {
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
    } else {
        data.dateCreation = new Date();
    }
    return SupplierRegistry.createSupplier(data, req.decoded)
        .then(res => {
            return res;
        })
        .catch(err => {
            loggerT.verbose('Err  = ', err);
            res.status(500).json({status: err.message})
            return err;
        })
    ;

}
