
import { BotMsgHandler } from './msg-handler';
import { Contact, Message } from 'wechaty'
import { WeChatyApiX } from '../bot-utils';
import { ROOM_LIST,BOT_MODE} from "../global";
const resource_url:string="http://xmahaooo.mikecrm.com/nTkzl48";
export class PrivateMsgHandler implements BotMsgHandler {
    doMsgProcess(msg: Message): boolean {
        console.log("对私聊进行处理");
        let isContinued = true;
        let content = msg.content().toLocaleLowerCase();
        let isProcessed :boolean = Object.keys(commondList).some(command => {
            if (content.startsWith(command)) {
                console.log("收到消息包含指令" + command)
                content = content.replace(command, "");
                console.log(content);
                if (commondList[command](content, msg.from())) {
                    isContinued = false;
                };
                return true;
            }
            return false;
        });
        if(!isProcessed){
            if(BOT_MODE.isBotMode()){
                if (commondList["default"](content, msg.from())) {
                    isContinued = false;
                };
            }
        }
        return isContinued;
    }
    isSupport(msg: Message): boolean {
        console.log(msg);
        return WeChatyApiX.isPrivateTalkWithMe(msg) && ! msg.from().self();
    }
}


interface CommandProcessor {
    [commond: string]: (msg: string, from: Contact) => Boolean
}

function getRoomContent() {
    let res = "";
    Object.keys(ROOM_LIST).forEach(item => {
        res += "回复 "+item + " : 加入" + ROOM_LIST[item] + "\n";
    })
    return res;
}

let commondList: CommandProcessor = {
    "aha": (msg: string, from: Contact): Boolean => {
        console.log("开始拉人入群" + msg);
        let roomName = ROOM_LIST["aha"];
        if (roomName != null || roomName != undefined) {
            let room = WeChatyApiX.getRoomByTopic(roomName);
            room.then(item => {
                if (item != null) {
                    item.add(from);
                    from.say("收到指令！我将拉您入群:" + roomName);
                }

            }).catch(item => console.log(item));
        }
        return true;
    },
    "报名":(msg:string ,from:Contact):Boolean =>{
        from.say("以下是季东来成为故事高手报名链接\n"+resource_url);
        return true;
    },
    "default": (msg: string, from: Contact): Boolean => {
        let content = [
            "不好意思，AHA君没能理解您的意思，请按如下方式获取帮助(机器人值守):",
            "输入下列关键词",
            getRoomContent(),
            "回复 报名 : 获取成为故事高手报名链接"
        ]

        let res = content.reduce((sum, val) => {
            return sum + val + "\n";
        }, "")
        console.log("对"+from.name()+"说"+res);
        from.say(res);
        return true;
    }

}




