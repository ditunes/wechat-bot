import { PrivateMsgHandler } from './msgHandler/private-msg-handler';
import { BotMsgHandler } from './msgHandler/msg-handler';
import {AdminMsgHandler}from "./msgHandler/admin-msg-handler"
import { Message } from 'wechaty'
export class BotMsgProcessor{
    list:Array<BotMsgHandler> =[ new AdminMsgHandler(),new PrivateMsgHandler()]
    process :(msg:Message)=>void = (msg)=>{
        if(msg.from().self()){
            return ;
        }
        this.list.some((element,index, array) => {
            if(element.isSupport(msg)){
                if(!element.doMsgProcess(msg)){
                    return true;
                }  
            }
            return false;
        });
    }
}

export const BOT_MSG_PROC :BotMsgProcessor = new BotMsgProcessor();