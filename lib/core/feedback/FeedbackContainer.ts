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

    async addNewFeedback(obj: Feedback, user: User): Promise<Feedback>{
        let tempFeedback = new Feedback();
        tempFeedback.content = obj.content;
        tempFeedback.user = user;
        let feedback = await getManager().save(tempFeedback);
        return feedback;
    }
}