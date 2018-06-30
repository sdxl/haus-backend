import * as express from "express";
import { Request, Response, NextFunction } from "express";

export default class RouteAuthenticator{
    public isAuthenticated(req: Request, res: Response, next: NextFunction){
        if(req.session.subject){
            next();
        }else{
            res.sendStatus(403);
        }
    }
}