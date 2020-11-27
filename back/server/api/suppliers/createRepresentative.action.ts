
import { RepresentativeSchema } from '../../components/supplier/representativeSchema';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => createRepresentative(req, res, app.get('SupplierRegistry')),
};

export function createRepresentative(req, res, SupplierRegistry) {
    if(!req.decoded) {
        return Promise.reject(`Cannot get user informations, invalid request.`);
    }

    loggerT.verbose('Creating representative.');

    let repres;

    if(!req.body || !req.body.repres || !req.body.supplierID) {
        const error = new Error(`Invalid request, error message: no body provided.`);
        error['statusCode'] = 400;
        throw error;
    }

    RepresentativeSchema.validate(req.body.repres, (err, val) => {
        if (err && err.details[0].message) {
            const error = new Error(`Invalid request, error message: ${err.details[0].message}.`);
            error['statusCode'] = 400;
            throw error;
        }
        repres = val;
    });

    return SupplierRegistry.createRepresentative(repres, req.body.supplierID, req.decoded)
        .then(res => {
            loggerT.verbose('[createRepresentative] res  = ', res);
            return res;
        })
        .catch(err => {
            loggerT.verbose('[createRepresentative] Err  = ', err);
            res.status(500).json({status: err.message})
            return err;
        })
    ;

}
