import { RoomUtlils } from '../room-utils';
import { BotMsgHandler } from './msg-handler';
import { Contact, Message } from 'wechaty'
import { WeChatyApiX } from '../bot-utils';
import { BOT_MODE } from '../global'

export class AdminMsgHandler implements BotMsgHandler {
    doMsgProcess(msg: Message): boolean {
        
        let content = msg.content().toLocaleLowerCase();
        let from = msg.from();
        let isContinued = true;
        let isProcessed = Object.keys(commandList).some(command => {
            if (content.startsWith(command)) {
                console.log("收到消息包含指令" + command)
                content = content.replace(command, "");
                console.log(content);
                if (commandList[command].handle(content, from)) {
                    isContinued = false;
                };
                return true;
            }
            return false;
        });
        if (!isProcessed && BOT_MODE.isBotMode()) {
            commandList["help"].handle(content, from);
            isContinued = false;
        }
        return isContinued;
    }
    isSupport(msg: Message): boolean {
        return WeChatyApiX.isFromAdmin(msg);
    }
}

async function sayMsgToTargetContracts(contacts: Contact[], msgs: Array<string>) {
    let index = 0;
    let total = contacts.length;
    console.log(`he ${contacts} `)
    let timer = setInterval(async () => {
        msgs.forEach(item => {
            console.log(contacts[index]);
            contacts[index].say(contacts[index].name()+" "+item);
        })
        if (index >= total) {
            clearInterval(timer);
        }
        index++;
    }, 5000);
}

async function sayMsgToAllContract(msgs: Array<string>) {
    let contactAll = await Contact.findAll();
    sayMsgToTargetContracts(contactAll, msgs);
}

interface CommandProcessor {
    [commond: string]: Processor
}
interface Processor {
    handle: (msg: string, from: Contact) => Boolean
    desc: string
}

let commandList: CommandProcessor = {
    "all@": {
        handle: (msg: string, from: Contact): Boolean => {
            console.log("开始群发消息" + msg);
            sayMsgToAllContract([msg]);
            return true;
        },
        desc: "all@你要说的话 可以将其群发至所有好友"
    },
    "room@":{
        handle: (msg: string, from: Contact): Boolean => {
            RoomUtlils.saySomethingToDefaultRoom(msg);
            return true;
        },
        desc:"将发送指定消息到默认群",
    },
    "human#" : {handle:(msg: string, from): Boolean => {
        BOT_MODE.humanMode();
        return true;
    }, desc:"开启人工操作模式"},
"bot#":{
    handle: (msg: string, from): Boolean => {
        BOT_MODE.botMode();
        return true;
    }, desc:"开启机器人自动模式"
},
"help":{
    handle: (msg: string, from): Boolean => {
        let res = Object.keys(commandList).reduce((sum, item) => {
            sum += item + ":" + commandList[item].desc + "\n";

            return sum;
        }, "管理员操作面板(输入对应的指令)：\n")
        from.say(res);
        return true;
    }, desc:"获取管理员操作帮助"
}
}




