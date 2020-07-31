import { UserSchema }from '../../components/users/userSchema';
import { trim, replace } from 'lodash';
import * as moment from 'moment';

declare var loggerT: any;

export default {
    method: 'get',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => getSuppliers(req, app.get('AdminRegistry')),
};

export function getSuppliers(req, AdminRegistry) {

    loggerT.info('[ADMIN] Getting supplier users.');

    const query = req.query || {};
    loggerT.verbose('query = ', query);

    return AdminRegistry.getSuppliersUsers(query)
        .then(res => {
            let result = {
                items: res
            };
            return result;
        })
        .catch(err => {
            return err;
        })
    ;

}
