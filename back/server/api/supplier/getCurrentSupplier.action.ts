import { UserSchema }from '../../components/users/userSchema';
import { trim, replace } from 'lodash';
import * as moment from 'moment';

declare var loggerT: any;

export default {
    method: 'get',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => getCurrentLogged(req, res, app.get('SupplierRegistry'), app.get('AuthRegistry')),
};

export function getCurrentLogged(req, res, SupplierRegistry, AuthRegistry) {
    let decoded;
    loggerT.verbose('Getting current logged supplier cookie', req.cookies.auth);
    // if(!req.decoded) {
    //     return {
    //         authentified: false,
    //         supplier: {}
    //     };
    // }

    return AuthRegistry.validateToken(req.cookies.auth).then((res) => {
        if (res.code === 200) {
            decoded = res.token;
            loggerT.verbose('Getting current logged supplier with id:', res.token);

            return SupplierRegistry.getCurrentLogged(decoded)
                .then(res => {
                    if(res && res[0]) {
                        return {
                            authentified: true,
                            supplier: res[0]
                        };
                    } else {
                        return {
                            authentified: false,
                            supplier: {}
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
                supplier: {}
            };
        }
    }, (err) => {
        return res.status(500).json({
            success: false,
            message: "Unexpected error : " + err.message
        });
    });

}
