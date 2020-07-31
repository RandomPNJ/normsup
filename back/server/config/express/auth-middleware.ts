import {ExpressMiddlewareInterface} from "routing-controllers/driver/express/ExpressMiddlewareInterface";
import {JSONWebToken} from './jwt-class';
import * as AuthRegistry from '../../components/auth/authRegistry';

export class AuthenticatorMiddleware implements ExpressMiddlewareInterface {

    public authService: AuthRegistry.default = new AuthRegistry.default();

    public use(request: any, response: any, next?: (err?: any) => any): any {
        console.log('Auth one');
        let token;
        if(request.cookies.auth) {
            token = request.cookies.auth;
        } else {
            return response.status(400).json({
                success: false,
                message: "Unexpected error : User is not authentified.",
                reason: -2
            }); 
        }
        return this.authService.validateToken(token).then((res) => {
            if (res.code === 200) {
                request.decoded = res.token;
                next();
            } else {
                console.log('res error ', res.code)
                if (res.code === 401) {
                    return response.status(res.code).json({
                        success: false,
                        message: res.msg,
                        reason: -2
                    });
                } else if(res.code === 403 && res.originalMessage === 'jwt expired') {
                    return response.status(res.code).json({
                        success: false,
                        message: res.msg,
                        reason: -1
                    });
                } else {
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

    public useSupplier(request: any, response: any, next?: (err?: any) => any): any {
        console.log('Auth two');
        let token;
        if(request.cookies.supplier) {
            token = request.cookies.supplier;
        } else {
            return response.status(400).json({
                success: false,
                message: "Unexpected error : User is not authentified.",
                reason: -2
            }); 
        }
        return this.authService.validateToken(token).then((res) => {
            if (res.code === 200) {
                request.decoded = res.token;
                next();
            } else {
                console.log('res error ', res.code)
                if (res.code === 401) {
                    return response.status(res.code).json({
                        success: false,
                        message: res.msg,
                        reason: -2
                    });
                } else if(res.code === 403 && res.originalMessage === 'jwt expired') {
                    return response.status(res.code).json({
                        success: false,
                        message: res.msg,
                        reason: -1
                    });
                } else {
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

    public useAdmin(request: any, response: any, next?: (err?: any) => any): any {
        console.log('Auth admin');
        let token;
        if(request.cookies.admin) {
            token = request.cookies.admin;
        } else {
            return response.status(400).json({
                success: false,
                message: "Unexpected error : Admin is not authentified.",
                reason: -2
            }); 
        }
        return this.authService.validateToken(token).then((res) => {
            if (res.code === 200) {
                request.decoded = res.token;
                next();
            } else {
                console.log('res error ', res.code)
                if (res.code === 401) {
                    return response.status(res.code).json({
                        success: false,
                        message: res.msg,
                        reason: -2
                    });
                } else if(res.code === 403 && res.originalMessage === 'jwt expired') {
                    return response.status(res.code).json({
                        success: false,
                        message: res.msg,
                        reason: -1
                    });
                } else {
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
