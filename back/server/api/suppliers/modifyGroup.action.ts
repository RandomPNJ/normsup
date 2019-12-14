
import { cloneDeep } from 'lodash';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => modifyGroupReminders(req, res, app.get('SupplierRegistry')),
};

export function modifyGroupReminders(req, res, SupplierRegistry) {
    if (!req.decoded) {
        return Promise.reject(`Cannot get user informations, invalid request.`);
    }

    loggerT.verbose('Modifying group.');

    let group = {};
    // let suppliers = [];
    // let deleteSupp = [];

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
    group['name'] = req.body.name;
    group['client_id'] = req.decoded.organisation;
    group['id'] = parseInt(req.params.id, 10);

    // loggerT.verbose('Group info', group);
    loggerT.verbose('suppliers info', req.body.suppliers);
    loggerT.verbose('deleteSuppliers info', req.body.deleteSuppliers);

    return SupplierRegistry.updateGroup(group, req.body.suppliers, req.body.deleteSuppliers)
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
