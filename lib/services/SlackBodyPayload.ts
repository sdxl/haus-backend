
export class SlackAttachment{
    fallback?: string;
    author_name?: string;
    title?: string;
    text?: string
}

export default class SlackBodyPayload{
    public text?: string;
    public attachments?: [SlackAttachment];
}
