import {ExpressMiddlewareInterface} from "routing-controllers/driver/express/ExpressMiddlewareInterface";
import {JSONWebToken} from './jwt-class';
import * as AuthRegistry from '../../components/auth/authRegistry';

export class AuthenticatorMiddleware implements ExpressMiddlewareInterface {

    public authService: AuthRegistry.default = new AuthRegistry.default();

    public use(request: any, response: any, next?: (err?: any) => any): any {

        let token = JSONWebToken.getTokenFromRequest(request);
        return this.authService.validateToken(token).then((res) => {
            if (res.code === 200) {
                request.decoded = res.token;
                next();
            } else {
                if (res.rc === 401 || res.rc === 403) {
                    return response.status(res.code).json({
                        success: false,
                        message: res.msg
                    });
                } else {
                    return response.status(500).json({
                        success: false,
                        message: "Unexpected error : " + res.msg
                    });
                }
            }
        }, (err) => {
            return response.status(500).json({
                success: false,
                message: "Unexpected error : " + err.message
            });
        });
    }
}
