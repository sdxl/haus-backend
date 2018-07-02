import {Feedback} from "./Feedback";
import { getManager } from "typeorm";
import { User } from "../user/User";

export default class FeedbackContainer{
    constructor(){

    }

    async getAllFeedbackByUser(user: User): Promise<Feedback[]> {
        let allFeedback = await getManager().getRepository(Feedback).find({user: user})
        return allFeedback;
    }

    async addNewFeedback(obj: Feedback, user: User): Promise<boolean>{
        let feedback = new Feedback();
        feedback.content = obj.content;
        feedback.user = user;
        await getManager().save(feedback);
        return true;
    }
}