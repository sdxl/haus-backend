import * as express from "express";
import { Request, Response } from "express";
import FeedbackContainer from "../../core/feedback/FeedbackContainer";
import {Feedback} from "../../core/feedback/Feedback";
import SlackService from "../../services/SlackService";
import SlackBodyPayload from "../../services/SlackBodyPayload";
import RouteAuthenticator from "../RouteAuthenticator";
import { HausRequest } from "../HausRequest";

require('dotenv').config();

export default class FeedbackController{
    public routes: express.Router;
    private slackService: SlackService;

    constructor(){
        this.slackService = new SlackService();
        this.setRoutes();
    }

    private setRoutes(): void {
        const feedbackContainer = new FeedbackContainer();
        const router = express.Router();
    
        router.get('/', new RouteAuthenticator().isAuthenticated, async (req: HausRequest, res: Response) => {
          let feedbackForUser = await feedbackContainer.getAllFeedbackByUser(req.subject);
          res.send(200).json({
            feedback: feedbackForUser
          })
        });

        router.post('/', new RouteAuthenticator().isAuthenticated, async (req: HausRequest, res: Response) => {
            let tempFeedback = req.body as Feedback;
            let feedback = await feedbackContainer.addNewFeedback(tempFeedback, req.subject);
            
            let slackBody = new SlackBodyPayload();
            slackBody.attachments = [{author_name: req.subject.firstName, text: feedback.content}]

            this.slackService.submitToWebhook(process.env.SLACK_FEEDBACKURL, slackBody);
            res.send(201).json({feedback: feedback});
        });

        this.routes = router;
      }
}