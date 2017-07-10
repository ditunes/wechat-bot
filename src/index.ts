
import { FriendRequest } from 'wechaty/dist/src/friend-request';
import { Wechaty, Contact, Room, Message } from 'wechaty'
import {BOT_NAME} from "./global";
import {DEFAULT_ROOM_NAME} from "./global";
import {BOT_MSG_PROC} from "./BotMsgProcessor";
const roomName: string = DEFAULT_ROOM_NAME;
const noticeStrInSingle: string = `hello，我是${BOT_NAME}很高兴认识你，我已经邀请你进入群：${roomName}`
const inRoomNotice: string = "如果没有成功邀请您入群，您也可以回复 aha\n我会马上拉你入群！aha"
Wechaty.instance() // Singleton
    .on('scan', (url, code) => {
        let loginUrl = url.replace('qrcode', 'l')
        require('qrcode-terminal').generate(loginUrl)
        console.log(url)
    })
    .on('login', async (user) => { 
        console.log(`User ${user} logined`)
        setTimeout(async () => {
            let room = await Room.find({ topic: roomName });
            if (!room) {
                return;
            }
             console.log(">>>");
            room.on("join", async (inviteeList, inviter) => {
                console.log(inviteeList);
                inviteeList.forEach((item) => {
                   
                })
            })
            
        }, 20000)
    })
    .on('friend', async (contact: Contact, request?: FriendRequest) => {
        let newFriend;
        if (request) {  // 1. request to be friend from new contact
            request.accept()
            newFriend = request.contact;
            console.log('auto accepted for ' + contact + ' with message: ' + request.hello)
        } else {        // 2. confirm friend ship
            console.log('new friend ship confirmed with ' + contact)
        }
        let room = await Room.find({ topic: roomName })
        if (room != null && newFriend != null) {
            addAllContract(room, [newFriend]);
            contact.name();
            contact.say(noticeStrInSingle);
            contact.say(inRoomNotice);
            contact.say("您也可以按如下指令进行操作\n"+"回复 aha :加入季东来故事高手活动群\n"+"回复 报名 : 获取成为故事高手报名链接");
        } else {
            console.log(room == null ? "房间不存在" : "新朋友不存在");
        }
    }).on('message', async (message: Message) => {
        if (message.self()) {
            return;
        }
        BOT_MSG_PROC.process(message);
        // if(!handleAdminMessage(message)){
        //     doMainRoomMsg(message);
        // };

    })
    .init()
   
// async function doMainRoomMsg(message: Message): Promise<void> {
//     let room = await Room.find({ topic: roomName });
//     if (!room) {
//         return;
//     }
//     let msgRoom = message.room();
//     let toContact = message.to();
//     if (toContact && toContact.name() == BOT_NAME) {
//         doActionByCommandInSingle(room, message, message.from())
//     }

//     if (room && msgRoom) {
//         if (msgRoom.topic() !== room.topic()) {
//             return;
//         }
//         doActionByCommand(room, message);
//     }
// }
// function doActionByCommand(room: Room, msg: Message): void {
//     let command = msg.content();
//     if (command.includes("@" + BOT_NAME)) {
//         command = command.replace("@" + BOT_NAME, "").trim();
//     }

// }

// function doActionByCommandInSingle(room: Room, msg: Message, contact: Contact): void {
//     if (msg.content().toLowerCase() ==  "aha") {
//         console.log(`拉人入群${contact}`)
//         room.add(contact);
//     }
// }


function processContactListInRoom(room: Room, list: Array<Contact>, handler: (r: Room, c: Contact) => void): void {
    if (!room) {
        return;
    }
    list.forEach(element => {
        if (element) {
            handler(room, element);
        }
    });
    return;
}

function addAllContract(room: Room, list: Array<Contact>): void {
    processContactListInRoom(room, list, (room, contact) => {
        console.log(contact);
        let name = contact.alias()
        name = name == null ? contact.name() : name;
        try {
            room.add(contact);
        } catch (error) {
            console.log(`${name}拉入${room.topic()}失败`)
        }
    })
}