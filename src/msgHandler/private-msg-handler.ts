
import { BotMsgHandler } from './msg-handler';
import { Contact, Message } from 'wechaty'
import { WeChatyApiX } from '../bot-utils';
import {  BOT_MODE } from "../global";
import { CoinQuery } from "../coinQueryService";
import { sayToContact} from '../say';
export class PrivateMsgHandler implements BotMsgHandler {
    doMsgProcess(msg: Message): boolean {
        console.log("对私聊进行处理");
        let isContinued = true;
        let content = msg.content().toLocaleLowerCase().trim();
        let isProcessed: boolean = Object.keys(commondList).some(command => {
            if (new RegExp(command).test(content)) {
                console.log("收到消息包含指令" + command)
                console.log(content);
                if (commondList[command](content, msg.from())) {
                    isContinued = false;
                };
                return true;
            }
            return false;
        });
        if (!isProcessed) {
            if (BOT_MODE.isBotMode()) {
                if (commondList["default"](content, msg.from())) {
                    isContinued = false;
                };
            }
        }
        return isContinued;
    }
    isSupport(msg: Message): boolean {
        return WeChatyApiX.isPrivateTalkWithMe(msg) && ! msg.from().self() && BOT_MODE.isBotMode();
    }
}


interface CommandProcessor {
    [commond: string]: (msg: string, from: Contact) => Boolean
}

let commondList: CommandProcessor = {
    "^\\w+$": (msg: string, from: Contact): Boolean => {
        CoinQuery.query(msg).then(item => {
            if (item == null) {
                return;
            }
            sayToContact(from, item);
        });
        return true;
    },
    "default": (msg: string, from: Contact): Boolean => {
        let content = [
            "不好意思，没能理解您的意思，请按如下方式获取帮助(机器人值守):",
            "输入币名获取最新信息"
        ]
        let res = content.reduce((sum, val) => {
            return sum + val + "\n";
        }, "")
        console.log("对" + from.name() + "说" + res);
        sayToContact(from,res);
        return true;
    }

}




