import {Request} from "express";
import * as jwt from "jsonwebtoken";



export class JSONWebToken {

    protected decodedToken: any;

    // TODO: Change decode to verify
    public constructor(request: Request) {
        this.decodedToken = jwt.decode(JSONWebToken.getTokenFromRequest(request));
    }

    public getEmail(): string {
        return this.decodedToken ? this.decodedToken.userEmail : null;
    }

    public getCompany(): string {
        return this.decodedToken ? this.decodedToken.company : null;
    }

    public getUserName(): string {
        return this.decodedToken ? this.decodedToken.userName : null;
    }

    public getUser(): string {
        return this.decodedToken ? this.decodedToken : null;
    }

    public static getTokenFromRequest(req: Request): string {
        let token = req.header('Authorization').replace('Bearer', '').trim();

        if (!token) {
            token = req.body ? req.body.token : null;
        }
        if (!token) {
            token = req.query ? req.query.access_token : null;
        }
        return token;
    }
}