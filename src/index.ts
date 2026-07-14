import { FriendRequest } from 'wechaty/dist/src/friend-request';
import { Wechaty, Contact, Room, Message } from 'wechaty'

// WeChat bot built with Wechaty.
// Automatically accepts friend requests, invites contacts into a target group,
// greets new members, replies to keyword commands, and filters offensive messages.

// Target group name and bot identity
const roomName: string = "厦门区块链活动交流群"
// Shared resource link sent when users ask for "比特币" (Bitcoin)
const resource: string = "这里有一个区块链资源看板快去看看吧，小白欢迎小伙伴们一起添砖加瓦噢 想要往里共享东西的小伙伴"  
+"把trello注册邮箱发给小助手哦! https://trello.com/b/yWFLtFO8/-"
const myName: string = "小白助手"
// Greeting sent to newly joined group members
const welcomeStr: string = `欢迎来到${roomName}, 快发送关键词：\n比特币@${myName}\n 有彩蛋哦`
// Message sent to new friends in private chat
const noticeStrInSingle: string = "hello，我是小白很高兴认识你，如果没有成功邀请您入群，您可以回复:"
    + "比特币\n"
    + "我会马上拉你入群！haha"

Wechaty.instance() // Singleton
    // Print QR code in the terminal for WeChat login
    .on('scan', (url, code) => {
        let loginUrl = url.replace('qrcode', 'l')
        require('qrcode-terminal').generate(loginUrl)
        console.log(url)
    })
    // After login, locate the target room and listen for new members joining
    .on('login', async (user) => {
        console.log(`User ${user} logined`)
        setTimeout(async () => {
            let room = await Room.find({ topic: roomName });
            if (!room) {
                return;
            }
            // Welcome each new member who joins the group
            room.on("join", async (inviteeList, inviter) => {
                inviteeList.forEach((item) => {
                    console.log(`来人了：${item}`)
                    if (room) {
                        room.say(welcomeStr, item)
                    }
                })
            })
            testAddSomeone(room);
        }, 2000)
    })
    // Handle friend requests: auto-accept and invite the new friend into the group
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
    // Handle incoming messages: ignore self messages, respond to commands, and moderate group chat
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
        // Reply to private chat commands sent to the bot
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

// Respond to group commands that mention the bot
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

// Respond to private chat commands by adding the contact to the group
function doActionByCommandInSingle(room: Room,msg: Message, contact:Contact): void {
    if(msg.content()==="比特币"){
        console.log(`拉人入群${contact}`) 
        room.add(contact);
    }
}

// Test helper: add a specific contact to the group by alias
 async function testAddSomeone(room:Room):Promise<void>{
      let contact = await Contact.find({ alias: "乾坤" });
            if (contact == null) {
                return;
            }
            addAllContract(room, [contact]);
 }


// Utility to apply a handler to every contact in a list
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

// Moderate group messages and warn users who send offensive content
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

// Add a list of contacts to the target group
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
