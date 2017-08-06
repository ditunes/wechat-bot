import { Message } from 'wechaty'
export interface BotMsgHandler{
    doMsgProcess(msg:Message) :boolean;
    isSupport(msg:Message) : boolean;
}
