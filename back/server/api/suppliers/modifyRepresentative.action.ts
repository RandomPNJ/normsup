
import { RepresentativeSchema } from '../../components/supplier/representativeSchema';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => updateRepresentative(req, res, app.get('SupplierRegistry')),
};

export function updateRepresentative(req, res, SupplierRegistry) {
    if(!req.decoded) {
        return Promise.reject(`Cannot get user informations, invalid request.`);
    }

    loggerT.verbose('Modifying representative.');

    let repres;

    if(!req.params || !req.params.id) {
        const error = new Error(`Invalid request, error message: no id provided.`);
        error['statusCode'] = 400;
        throw error;
    }
    if(!req.body) {
        const error = new Error(`Invalid request, error message: no body provided.`);
        error['statusCode'] = 400;
        throw error;
    }

    RepresentativeSchema.validate(req.body, (err, val) => {
        if (err && err.details[0].message) {
            const error = new Error(`Invalid request, error message: ${err.details[0].message}.`);
            error['statusCode'] = 400;
            throw error;
        }
        repres = val;
    });

    return SupplierRegistry.updateRepresentative(repres, req.params.id,req.decoded)
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
