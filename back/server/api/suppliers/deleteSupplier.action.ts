
import { cloneDeep } from 'lodash';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => deleteSupplier(req, res, app.get('SupplierRegistry')),
};

export function deleteSupplier(req, res, SupplierRegistry) {
    if (!req.decoded) {
        return Promise.reject(`Cannot get user informations, invalid request.`);
    }

    loggerT.verbose('Deleting supplier.');

    if(!req.params || !req.params.id) {
        const error = new Error(`Invalid request, error message: no id provided.`);
        error['statusCode'] = 400;
        throw error;
    }
    
    return SupplierRegistry.deleteSupplier(req.params.id, req.decoded.organisation)
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
