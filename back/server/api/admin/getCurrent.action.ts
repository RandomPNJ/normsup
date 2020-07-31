import { UserSchema }from '../../components/users/userSchema';
import { trim, replace } from 'lodash';
import * as moment from 'moment';

declare var loggerT: any;

export default {
    method: 'get',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => getCurrentUser(req, res, app.get('AdminRegistry'), app.get('AuthRegistry')),
};

export function getCurrentUser(req, res, AdminRegistry, AuthRegistry) {
    let decoded;
    loggerT.verbose('[ADMIN] Getting current logged administrator.');


    return AuthRegistry.validateToken(req.cookies.admin).then((res) => {
        if (res.code === 200 && res.token.id) {
            decoded = res.token;
            loggerT.verbose('Getting current logged user with id:', res.token);

            return AdminRegistry.getAdmin(decoded.id, decoded.email)
                .then(result => {
                    loggerT.verbose('[getCurrentUser] Final result ', result);
                    if(result && result.id) {
                        return {
                            authentified: true,
                            user: result
                        };
                    } else {
                        return {
                            authentified: false,
                            user: {}
                        };
                    }
                })
                .catch(err => {
                    return err;
                })
            ;
        } else {
            return {
                authentified: false,
                user: {}
            };
        }
    }, (err) => {
        return res.status(500).json({
            success: false,
            message: "Unexpected error : " + err.message
        });
    });

}
