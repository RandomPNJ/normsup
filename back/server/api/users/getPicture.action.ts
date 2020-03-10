import { UserSchema }from '../../components/users/userSchema';
import { trim, replace } from 'lodash';
import * as moment from 'moment';

declare var loggerT: any;

export default {
    method: 'get',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => getPicture(res, req, app.get('UsersRegistry')),
};

export function getPicture(res, req, UsersRegistry) {

    loggerT.verbose('Req decoded ', req.decoded);
    if(!req.decoded) {
        const error = new Error(`Invalid request, could not get information from token.`);
        error['statusCode'] = 400;
        throw error;
    }

    return UsersRegistry.getPicture(req.decoded.id)
        .then(result => {
            res.set({'Content-Type': 'image/png'});
            res.attachment('profile-pic.png');
            return res.send(result.Body);
        })
        .catch(err => {
            return err;
        })
    ;

}
