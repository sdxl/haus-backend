import * as request from "request";
import SlackBodyPayload from "./SlackBodyPayload";

export default class SlackService{s

    submitToWebhook(webhookUrl: string, payload: SlackBodyPayload): void{
        request.post({url: webhookUrl, json: true, body: payload }, (err, resp, body) => {
            if(err) console.log("failed to send error is: " + err);
            if(resp) console.log("Slack resp.statusCode is: " + resp.statusCode);
        })
    }
}