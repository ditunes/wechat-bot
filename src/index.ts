
import { FriendRequest } from 'wechaty/dist/src/friend-request';
import { Wechaty, Room, Contact, Message } from 'wechaty'
import { BOT_MSG_PROC } from './BotMsgProcessor';
import { setAllRoom } from './global';
Wechaty.instance() // Singleton
    .on('scan', async (url, code) => {
        let loginUrl = url.replace('qrcode', 'l')
        require('qrcode-terminal').generate(loginUrl)
        console.log(url)
    })
    .on('login', async (user) => {
        console.log(`User ${user} logined`)
        setTimeout(async function(){
        try {
            console.log("查询裙")
            let roomList: Room[] = await Room.findAll();
            console.log(`ddd : ${roomList}`);
             console.log("查询裙好了")
            setAllRoom(roomList);
        } catch (error) {
            console.log(error);
        }
        },10000);
    })
    .on('friend', async (contact: Contact, request?: FriendRequest) => {
        //let newFriend;
        if (request) {  // 1. request to be friend from new contact
            request.accept()
            //newFriend = request.contact;
            console.log('auto accepted for ' + contact + ' with message: ' + request.hello)
        } else {        // 2. confirm friend ship
            console.log('new friend ship confirmed with ' + contact)
        }
    }).on('message', async (message: Message) => {
        BOT_MSG_PROC.process(message);
    }).init();






