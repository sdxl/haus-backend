import * as express from "express";
import * as bodyParser from "body-parser";
import FeedbackController from "./rest/controllers/FeedbackController";
import "reflect-metadata";
import { createConnection } from "typeorm";
import {Feedback} from "./core/feedback/Feedback";
import PrincipalController from "./rest/controllers/PrincipalController";
import { Principal } from "./core/security/Principal";
import * as ExpressSession from "express-session";
import { User } from "./core/user/User";
import * as config from "./config";
import RouteAuthenticator from "./rest/RouteAuthenticator";

class App {

  constructor() {
    this.app = express();
    this.app.use(ExpressSession({
      secret: "my-greatest-secret",
      cookie:{
        maxAge: 60 * 60 * 1000,
      },
      resave: false,
      saveUninitialized: false,
      rolling: true
    }));

    this.connectDB();
    this.config();
    this.routes();
  }

  public app: express.Application;

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
  }

  private routes(): void {
    this.app.use('/auth', new PrincipalController().routes);
    this.app.use('/feedback', new RouteAuthenticator().isAuthenticated, new FeedbackController().routes);
  }

  private async connectDB(){
      await createConnection({
        type: "mysql",
        host: config.env.mysql.host,
        port: config.env.mysql.port,
        username: config.env.mysql.username,
        password: config.env.mysql.password,
        database: config.env.mysql.database,
        entities: [Feedback, Principal, User],
        synchronize: true
    });
  }
}

export default new App().app;