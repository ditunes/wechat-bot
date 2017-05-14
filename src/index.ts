import { Gender } from 'wechaty/dist/src/contact';
import { FriendRequest } from 'wechaty/dist/src/friend-request';
import { Wechaty, Contact, Room, Message } from 'wechaty'
const roomName: string = "scrum回顾游戏和活动引导之厦门AHA"
const resource: string = "Ethan活动报名名单https://shimo.im/sheet/Utl2QpUIqkAr3M1X?from=groupmessage&amp;isappinstalled=0500https://shimo.im/sheet/Utl2QpUIqkAr3M1X?from=groupmessage&amp;isappinstalled=00gh_eb1395bf42e7oldhomelh01"
const myName: string = "厦门AHA侦探社"
const welcomeStr: string = `欢迎来到${roomName}`
const noticeStrInSingle: string = `hello，我是${myName}很高兴认识你，如果没有成功邀请您入群，您可以回复 AHA\n我会马上拉你入群！AHA`

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
            room.on("join", async (inviteeList, inviter) => {
                console.log(inviteeList);
                inviteeList.forEach((item) => {
                    console.log(`来人了：${item}`)
                    if (room) {
                        if (item.gender() == Gender.Male || item.gender() == Gender.Unknown) {
                            room.say("hello 帅哥" + welcomeStr, item)
                        } else {
                            room.say("hello 美女" + welcomeStr, item)
                        }
                    }
                })
            })
        }, 2000)
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
        } else {
            console.log(room == null ? "房间不存在" : "新朋友不存在");
        }
    }).on('message', async (message: Message) => {
        if (message.self()) {
            return;
        }
        doHelp(message);
        doMainRoomMsg(message);

    })
    .init()
async function doHelp(message: Message): Promise<void> {
    let room = await Room.find({ topic: "Ethan活动组织者" });
    let msgRoom = message.room();
    let toContact = message.to();
    console.log("收到指令:" + message.content())
    if (room && msgRoom) {
        if (msgRoom.topic() !== room.topic()) {
            return;
        }
        
        if (toContact && toContact.name() == myName) {
            let command = message.content()
            if (command.includes("@" + myName)) {
                console.log(command)
                command = command.replace("@" + myName, "").trim();
                 if (command === "报名") {
                    room.say(resource, message.from());
                 }
            }
        }
    }
}
async function doMainRoomMsg(message: Message): Promise<void> {
    let room = await Room.find({ topic: roomName });
    if (!room) {
        return;
    }
    let msgRoom = message.room();
    let toContact = message.to();
    if (toContact && toContact.name() == myName) {
        doActionByCommandInSingle(room, message, message.from())
    }

    if (room && msgRoom) {
        if (msgRoom.topic() !== room.topic()) {
            return;
        }
        filterTargetRoomMsg(room, message);
        doActionByCommand(room, message);
    }
}
function doActionByCommand(room: Room, msg: Message): void {
    let command = msg.content();
    if (command.includes("@" + myName)) {
        command = command.replace("@" + myName, "").trim();
        // if (command === "比特币") {
        //     console.log("收到指令:" + command)
        //     room.say(resource, msg.from());
        // }
    }

}

function doActionByCommandInSingle(room: Room, msg: Message, contact: Contact): void {
    if (msg.content() === "AHA") {
        console.log(`拉人入群${contact}`)
        room.add(contact);
    }
}


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

function filterTargetRoomMsg(room: Room, message: Message) {
    if (message.content().match("美女|fuck|妈蛋|我操|傻逼")) {
        room.say("不要说脏话", message.from());
        //room.del(message.from());
    }
    console.log(`Message: ${message}`);
}

// function removeContact(room: Room, list: Array<Contact>): void {
//     processContactListInRoom(room, list, (room, contact) => {
//         room.del(contact);
//     });
//     return;
// }

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