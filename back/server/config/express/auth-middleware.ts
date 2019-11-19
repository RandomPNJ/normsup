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
                console.log('res error ', res.code)
                if (res.code === 401) {
                    console.log('case one')
                    return response.status(res.code).json({
                        success: false,
                        message: res.msg,
                        reason: -2
                    });
                } else if(res.code === 403 && res.originalMessage === 'jwt expired') {
                    console.log('case two')
                    return response.status(res.code).json({
                        success: false,
                        message: res.msg,
                        reason: -1
                    });
                } else {
                    console.log('case three')
                    return response.status(500).json({
                        success: false,
                        message: "Unexpected error : " + res.msg,
                        reason: -2
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
