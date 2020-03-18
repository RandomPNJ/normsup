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
    let data = {};
    const query = req.query;

    if(query && query.search) {
        data['search'] = query.search;
    }

    if(query && query.clientID && query.clientID !== 0) {
        data['clientID'] = query.clientID;
    }

    return AdminRegistry.getSuppliers(data)
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
