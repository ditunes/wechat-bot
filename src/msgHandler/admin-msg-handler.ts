//import { RoomUtlils } from '../room-utils';
import { BotMsgHandler } from './msg-handler';
import { Contact, Message, Room } from 'wechaty'
import { WeChatyApiX } from '../bot-utils';
import { getAllRoom, refreshRoomList, BOT_MODE } from "../global";
import { CoinQuery } from "../coinQueryService";
import { sayToContact, sayToRoom } from '../say';

export class AdminMsgHandler implements BotMsgHandler {
    doMsgProcess(msg: Message): boolean {
        let content = msg.content().toLocaleLowerCase().trim();
        let from = msg.from();
        let isContinued = true;
        let isProcessed = Object.keys(commandList).some(command => {
            if (new RegExp(command, "g").test(content)) {
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
        return (WeChatyApiX.isPrivateTalkWithMe(msg) && msg.self()) || 
        WeChatyApiX.isFromAdmin(msg);
    }
}

// async function sayMsgToTargetContracts(contacts: Contact[], msgs: Array<string>) {
//     let index = 0;
//     let total = contacts.length;
//     console.log(`he ${contacts} `)
//     let timer = setInterval(async () => {
//         msgs.forEach(item => {
//             console.log(contacts[index]);
//             contacts[index].say(contacts[index].name() + " " + item);
//         })
//         if (index >= total) {
//             clearInterval(timer);
//         }
//         index++;
//     }, 5000);
// }

// async function sayMsgToAllContract(msgs: Array<string>) {
//     let contactAll = await Contact.findAll();
//     sayMsgToTargetContracts(contactAll, msgs);
// }

interface CommandProcessor {
    [commond: string]: Processor
}
interface Processor {
    handle: (msg: string, from: Contact) => Boolean
    desc: string,
    keyDesc:string
}

let commandList: CommandProcessor = {
    // "all@": {
    //     handle: (msg: string, from: Contact): Boolean => {
    //         console.log("开始群发消息" + msg);
    //         sayMsgToAllContract([msg]);
    //         return true;
    //     },
    //     desc: "all@你要说的话 可以将其群发至所有好友"
    // },
    "human#": {
        handle: (msg: string, from): Boolean => {
            BOT_MODE.humanMode();
            return true;
        }, desc: "开启人工操作模式",
        keyDesc:"human#"
    },
    "bot#": {
        handle: (msg: string, from): Boolean => {
            BOT_MODE.botMode();
            return true;
        }, desc: "开启机器人自动模式",
        keyDesc:"bot#"
    },
    "help": {
        handle: (msg: string, from): Boolean => {
            let res = Object.keys(commandList).reduce((sum, item) => {
                sum += commandList[item].keyDesc + ":" + commandList[item].desc + "\n";
                return sum;
            }, "管理员操作面板(输入对应的指令)：\n")
            from.say(res);
            return true;
        }, desc: "获取管理员操作帮助",
        keyDesc:"help"
    },
    "@refresh": {
        handle: (msg: string, from: Contact): Boolean => {
            refreshRoomList();
            return true;
        },
        desc: "刷新群组列表",
        keyDesc:"@refresh"
    },
    "@roomlist$": {
        handle: (msg: string, from: Contact): Boolean => {
            CoinQuery.query(msg).then(item => {
                if (item == null) {
                    return;
                }
                sayToContact(from, item);
            }).catch(item => {
                console.log(item);
            });
            let res: string = getAllRoom().map((val, index) => {
                return "[" + index + "]-" + val.topic() + "\n";
            }).reduce((sum, val) => {
                return sum + val;
            }, "");
            sayToContact(from, res);
            return true;
        },
        desc: "获取群组列表(需要等待1min，如果没加载完将无响应)",
        keyDesc:"@roomlist"
    },
    "@room\\((\\d+)\\)": {
        handle: (msg: string, from: Contact): Boolean => {
            let array: RegExpExecArray | null = new RegExp("@room\\((\\d+)\\)").exec(msg);
            console.log(array);
            if (array == null) {
                return true;
            }

            let content: string = msg.replace(array[0], "");
            let index: number = Number.parseInt(array[1]);
            console.log(content + "  | " + index);
            if (!Number.isNaN(index)) {
                let targetRoom: Room | null = getAllRoom()[index];
                if (targetRoom != null) {
                    sayToRoom(targetRoom, content);
                }
            }
            return true;
        },
        desc: "可发送消息至指定房间",
        keyDesc:"@room(房间序号) 你要说的话"
    },
    "@allroom": {
        handle: (msg: string, from: Contact): Boolean => {
            let content: string = msg.replace("@allroom", "");
            getAllRoom().forEach(item => {
                sayToRoom(item, content);
            });
            return true;
        },
        "desc": "可发送消息至所有房间",
        keyDesc:"@allroom 你要说的话"
    }
}




