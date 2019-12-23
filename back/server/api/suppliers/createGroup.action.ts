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
    let docSettings = {
        activated: 1,
        legal_docs: '',
        comp_docs: '',
        frequency: '5d'
    };
    group['name'] = req.body.name;
    group['client_id'] = req.decoded.organisation;
    if(req.body.suppliers.length > 0) {
        suppliers = cloneDeep(req.body.suppliers);
    }
    if(req.body.remindersSettings) {
        docSettings = req.body.remindersSettings;
    }
    loggerT.verbose('req.body.remindersSettings', req.body.remindersSettings);

    return SupplierRegistry.createGroup(group, suppliers, docSettings)
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
