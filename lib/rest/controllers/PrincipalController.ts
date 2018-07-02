import * as express from "express";
import { Request, Response } from "express";
import PrincipalContainer from "../../core/security/PrincipalContainer";
import * as jwt from "jsonwebtoken";
import { Session } from "../../core/session/Session";

export default class PrincipalController{
    public routes: express.Router;

    constructor(){
        this.setRoutes();
    }

    private setRoutes(): void {
        const principalContainer = new PrincipalContainer();
        const router = express.Router();
        
        router.post('/login', async (req: Request, res: Response) => {
            let user = await principalContainer.validatePrincipal(req.body);
            
            if(user != null){
                let token = jwt.sign({subject: user}, process.env.JWT_SECRET);
                let session = new Session();
                session.token = token;
                res.status(200).json({session: session});
            }else{
                res.sendStatus(400);
            }
        });

        router.post('/register', async (req: Request, res: Response) => {
            let tempPrincipal = req.body;
            let user = await principalContainer.addNewPrincipal(tempPrincipal);
            if(user != null){
                let token = jwt.sign({subject: user}, process.env.JWT_SECRET);
                let session = new Session();
                session.token = token;

                res.status(200).json({session: session});
            }else{
                res.sendStatus(400);
            }
        });

        this.routes = router;
      }
}