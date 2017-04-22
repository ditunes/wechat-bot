import { FriendRequest } from 'wechaty/dist/src/friend-request';
import { Wechaty, Contact, Room, Message } from 'wechaty'
const roomName: string = "test5"
const resource: string = " 您的比特币资料 http://baidu.com"
const myName: string = "D调的暖冬"
const welcomeStr: string = `欢迎来到${roomName},请发送关键词：比特币给${myName}将会有很多惊喜噢1`
const noticeStrInSingle: string = "hello，很高兴认识你如果没有成果邀请入群，您可以回复\n" +
    +"比特币"
    + "我会马上拉你入群\n"

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
                    console.log(item)
                    if (room) {
                        room.say(welcomeStr, item)
                    }
                })
            })
            let contact = await Contact.find({ alias: "蔡拓" });
            if (contact == null) {
                return;
            }
            await addAllContract(room, [contact]);
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
        // if (message.self()) {
        //     return;
        // }
        if(toContact && toContact.name() == myName ){
            doActionByCommandInSingle(room,message,toContact)
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
    let target = msg.to();
    if (target && target.name() == myName) {
        command = command.replace("@" + myName, "").trim();
        console.log(command + "|")
        if (command === "比特币") {
            console.log(command + "22")
            room.say(resource, msg.from());
        }
    }
}

function doActionByCommandInSingle(room: Room,msg: Message, contact:Contact): void {
    if(msg.content()=="比特币"){
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
    if (message.content().match("美女|fuck|妈蛋|我操")) {
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