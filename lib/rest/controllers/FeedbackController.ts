import * as express from "express";
import { Request, Response } from "express";
import FeedbackContainer from "../../core/feedback/FeedbackContainer";
import {Feedback} from "../../core/feedback/Feedback";
import SlackService from "../../services/SlackService";
import SlackBodyPayload from "../../services/SlackBodyPayload";
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
    
        router.get('/', async (req: Request, res: Response) => {
          let feedbackForUser = await feedbackContainer.getAllFeedbackByUserId(req.session.subject);
          res.json({
            feedback: feedbackForUser
          })
        });

        router.post('/', async (req: Request, res: Response) => {
            let tempFeedback = req.body as Feedback;
            await feedbackContainer.addNewFeedback(tempFeedback, req.session.subject);
            
            let slackBody = new SlackBodyPayload();
            slackBody.attachments = [{author_name: req.session.subject.firstName, text: tempFeedback.content}]

            this.slackService.submitToWebhook(process.env.SLACK_FEEDBACKURL, slackBody);
            res.sendStatus(200);
        });

        this.routes = router;
      }
}