import * as express from "express";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { User } from "core/user/User";
import { Session } from "core/session/Session";
import { HausRequest } from "./HausRequest";

export default class RouteAuthenticator{

    public async isAuthenticated(req: HausRequest, res: Response, next: NextFunction){
        let token = req.headers["x-access-token"] as string;
        if(!token){
            res.sendStatus(401);
            return;
        }

        try{
            let decodedToken = await jwt.verify(token, process.env.JWT_SECRET) as {subject: User};
            req.subject = decodedToken.subject;
            next();
        }catch(e){
            console.log("token decode failed with: ", e);
            res.sendStatus(401);
        }
    }
}