import { UserSchema }from '../../components/users/userSchema';
import { trim, replace } from 'lodash';
import * as moment from 'moment';

declare var loggerT: any;

export default {
    method: 'get',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => getClients(req, app.get('AdminRegistry')),
};

export function getClients(req, AdminRegistry) {
    let data = '';
    const query = req.query;

    if(query && query.search) {
        data = query.search;
    }

    loggerT.verbose('[ADMIN] Getting clients');

    return AdminRegistry.getClients(data)
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
