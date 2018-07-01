import * as express from "express";
import { Request, Response, NextFunction } from "express";

export default class RouteAuthenticator{
    public isAuthenticated(req: Request, res: Response, next: NextFunction){
        console.log("req.session.subject: ", req.session.subject);
        if(req.session.subject){
            next();
        }else{
            res.sendStatus(403);
        }
    }
}