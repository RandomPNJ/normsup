import {includes} from 'lodash';
import * as fs from 'fs';
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
    const body = req.body;

    return SupplierRegistry.createSupplier(body)
        .then(res => {
            return res;
        })
        .catch(err => {
            return err;
        })
    ;

}
