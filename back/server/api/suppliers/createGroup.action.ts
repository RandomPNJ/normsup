import { GroupSchema }from '../../components/supplier/groupSchema';
import { cloneDeep } from 'lodash';
import * as moment from 'moment';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '/define_supplier',
    services: [''],
    handler: (req, res, app) => createGroup(req, res, app.get('SupplierRegistry')),
};

export function createGroup(req, res, SupplierRegistry) {
    if (!req.decoded) {
        return Promise.reject(`Cannot get user informations, invalid request.`);
    }
    let group = {};
    let suppliers = [];
    group['name'] = req.body.name;
    group['client_id'] = req.decoded.organisation;
    if(req.body.suppliers.length > 0) {
        suppliers = cloneDeep(req.body.suppliers);
    }
    // GroupSchema.validate(req.body, (err, val) => {
    //     if (err && err.details[0].message) {
    //         const error = new Error(`Invalid request, error message: ${err.details[0].message}.`);
    //         error['statusCode'] = 400;
    //         throw error;
    //     }
    //     data = val;
    // });

    return SupplierRegistry.createGroup(group, suppliers)
        .then(res => {
            loggerT.verbose('Res  = ', res);
            return res;
        })
        .catch(err => {
            loggerT.verbose('Err  = ', err);
            res.status(500).json({status: 'Veuillez choisir un autre nom de groupe.'})
            return err;
        })
    ;

}
