import { GroupSchema }from '../../components/supplier/groupSchema';
import { cloneDeep } from 'lodash';
import * as moment from 'moment';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => deleteRepresentative(req, res, app.get('SupplierRegistry')),
};

export function deleteRepresentative(req, res, SupplierRegistry) {
    if (!req.decoded) {
        return Promise.reject(`Cannot get user informations, invalid request.`);
    }
    
    if(!req.params || !req.params.id) {
        const error = new Error(`Invalid request, error message: no id provided.`);
        error['statusCode'] = 400;
        throw error;
    }


    loggerT.verbose('deleteRepresentative req.decoded', req.decoded);
    return SupplierRegistry.deleteRepresentative(req.params.id, req.decoded)
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
