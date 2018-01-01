
import { FriendRequest } from 'wechaty/dist/src/friend-request';
import { Wechaty, Room, Contact, Message } from 'wechaty';
import { setAllRoom, getAllRoom } from './global';
import { BOT_MSG_PROC } from './BotMsgProcessor';
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
             roomList.forEach(item => {
                item.on("join",(inviteeList, inviter) => {
                      item.say("欢迎@"+inviter.name()+"加入Swft社区，我是SwftCoin智能机器人,您可以直接输入币名查询当前价格，如btc")  
                })
            })
        } catch (error) {
            console.log(error);
        }
        },10000);
    }).on('room-join', function(this, room, inviteeList, inviter) {
        console.info( 'Bot', 'EVENT: room-join - Room %s got new member %s, invited by %s',
            room.topic(),
            inviteeList.map(c => c.name()).join(','),
            inviter.name(),
          )
          room.say("欢迎@"+inviter.name()+"加入Swft社区，我是SwftCoin智能机器人,您可以直接输入币名查询当前价格，如btc")  
    }).on('friend', async (contact: Contact, request?: FriendRequest) => {
        //let newFriend;
        if (request) {  // 1. request to be friend from new contact
            await request.accept()
            contact.say("hello")
            let list:Room[] = getAllRoom();
            let index:number = parseInt(Math.random()*list.length+"");
            console.log(list[index])
            //list[index].refresh();
            // const result = await list[index].add(contact);
            // if(result){
            //     list[index].say("欢迎@"+contact.name()+"加入SWFT社区，您可以输入币名查询当前币价");
            // }else{
            //     console.log("error")
            // }
            console.log('auto accepted for ' + contact + ' with message: ' + request.hello)
        } else {        // 2. confirm friend ship
            console.log('new friend ship confirmed with ' + contact)
        }
    }).on('message', async (message: Message) => {
      
        BOT_MSG_PROC.process(message);
    }).init();






