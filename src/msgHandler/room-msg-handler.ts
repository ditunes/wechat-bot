
import { BotMsgHandler } from './msg-handler';
import { Message, Room } from 'wechaty'
//import { WeChatyApiX } from '../bot-utils';
import { BOT_MODE } from "../global";
import { CoinQuery } from "../coinQueryService";
import { sayToRoom } from '../say';
export class RoomMsgHandler implements BotMsgHandler {
    doMsgProcess(msg: Message): boolean {

        let room: Room | null = msg.room();
        if (room == null) {
            return false;
        }
        console.log("对群聊进行处理");
        let isContinued = true;
        let content = msg.content().toLocaleLowerCase().trim();
        let isProcessed: boolean = Object.keys(commondList).some(command => {
            if (new RegExp(command).test(content)) {
                console.log("收到消息包含指令" + command)
                console.log(content); 
                if(room == null) return false;
                if (commondList[command](content, room)) {
                    isContinued = false;
                };
                return true;
            }
            return false;
        });
        if (!isProcessed) {
            if (BOT_MODE.isBotMode()) {
                if (commondList["default"](content, room)) {
                    isContinued = false;
                };
            }
        }
        return isContinued;
    }
    isSupport(msg: Message): boolean {
        return msg.room() != null && BOT_MODE.isBotMode() //&& !msg.from().self();
    }
}


interface CommandProcessor {
    [commond: string]: (msg: string, from: Room) => Boolean
}

let commondList: CommandProcessor = {
    "^\\w+$": (msg: string, from: Room): Boolean => {
        CoinQuery.query(msg).then(item => {
            if (item == null) {
                return;
            }
            sayToRoom(from, item);
        });
        return true;
    },
    "default": (msg: string, from: Room): Boolean => {
        return true;
    }

}




