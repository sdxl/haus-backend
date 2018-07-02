import { User } from "core/user/User";
import { Request } from "express";

export interface HausRequest extends Request{
    subject: User
}