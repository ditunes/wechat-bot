import { FriendRequest } from 'wechaty/dist/src/friend-request';
import { Wechaty, Contact, Room, Message } from 'wechaty'
const roomName: string = "AT城市运动生活馆"
const resource: string = "有一个开发看，\n http://baidu.com"
const myName: string = "D调的暖冬"
const welcomeStr: string = `欢迎来到${roomName}, 快发送关键词：\n比特币@${myName}\n 有彩蛋哦`
const noticeStrInSingle: string = "hello，很高兴认识你，如果没有成功邀请您入群，您可以回复:"
    + "比特币\n"
    + "我会马上拉你入群！aha"

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
                inviteeList.forEach((item) => {
                    console.log(`来人了：${item}`)
                    if (room) {
                        room.say(welcomeStr, item)
                    }
                })
            })
            let contact = await Contact.find({ alias: "蔡拓" });
            if (contact == null) {
                return;
            }
            addAllContract(room, [contact]);
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
            contact.say(noticeStrInSingle);
        } else {
            console.log(room == null ? "房间不存在" : "新朋友不存在");
        }
    }).on('message', async (message: Message) => {
        let room = await Room.find({ topic: roomName });
        if(!room){
            return;
        }
        let msgRoom = message.room();
        let toContact = message.to();
        if (message.self()) {
            return;
        }
        if(toContact && toContact.name() == myName ){
            doActionByCommandInSingle(room,message, message.from())
        }

        if (room && msgRoom) {
            if (msgRoom.topic() !== room.topic()) {
                return;
            }
           
            filterTargetRoomMsg(room, message);
            doActionByCommand(room, message);
        }
        
    })
    .init()
function doActionByCommand(room: Room, msg: Message): void {
    let command = msg.content();
    if (command.includes("@" + myName)) {
        command = command.replace("@" + myName, "").trim();
        if (command === "比特币") {
            console.log("收到指令:" + command)
            room.say(resource, msg.from());
        }
    }
}

function doActionByCommandInSingle(room: Room,msg: Message, contact:Contact): void {
    if(msg.content()==="比特币"){
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