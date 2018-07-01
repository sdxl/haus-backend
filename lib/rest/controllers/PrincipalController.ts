import * as express from "express";
import { Request, Response } from "express";
import PrincipalContainer from "../../core/security/PrincipalContainer";

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
                console.log("user from login is: ", user);
                req.session.subject = user;
                console.log("retrieving session user: ", req.session.subject);
                req.session.save((err) => err ? console.log('err from save sess is: ', err) : "");
                res.sendStatus(200);
            }else{
                res.sendStatus(400);
            }
        });

        router.post('/register', async (req: Request, res: Response) => {
            let tempPrincipal = req.body;
            let user = await principalContainer.addNewPrincipal(tempPrincipal);
            if(user != null){
                req.session.subject = user;
                res.sendStatus(200);
            }else{
                res.sendStatus(400);
            }
        });

        router.post('/logout', async (req: Request, res: Response) => {
            req.session.destroy((err) => {
                if(err){
                    console.log(err);
                }
                res.sendStatus(200);
            })
        });

        this.routes = router;
      }
}