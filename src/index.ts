import { FriendRequest } from 'wechaty/dist/src/friend-request';
import { Wechaty, Contact, Message} from 'wechaty'
import * as rm from 'typed-rest-client/RestClient'
//const welcomeStr: string = `欢迎来到${roomName}, 快发送关键词：\n比特币@${myName}\n 有彩蛋哦`
// const noticeStrInSingle: string = "hello，我是小白很高兴认识你，如果没有成功邀请您入群，您可以回复:"
//     + "比特币\n"
//     + "我会马上拉你入群！haha"
const default_msg: string = "您可以输入币别进行查询当前行情如btc、eth";


Wechaty.instance() // Singleton
    .on('scan', (url, code) => {
        let loginUrl = url.replace('qrcode', 'l')
        require('qrcode-terminal').generate(loginUrl)
        console.log(url)
    })
    .on('login', async (user) => {
        console.log(`User ${user} logined`)
        // setTimeout(async () => {
        //     let room = await Room.find({ topic: roomName });
        //     if (!room) {
        //         return;
        //     }
        //     room.on("join", async (inviteeList, inviter) => {
        //         inviteeList.forEach((item) => {
        //             console.log(`来人了：${item}`)
        //             if (room) {
        //                 room.say(welcomeStr, item)
        //             }
        //         })
        //     })
        //     testAddSomeone(room);
        // }, 2000)
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
        newFriend.say(default_msg);
    }).on('message', async (message: Message) => {
        if (message.from().self()) {
            return;
        }
        let userAgent = 'User-Agent:Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N)'
            + 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36'

        let restc: rm.RestClient = new rm.RestClient(userAgent,
            'http://data.bter.com');
        let content = message.content().trim();
        if (!/^\w+$/.test(content)) {
            return;
        }


        console.log("receive :" + content);
        let res: rm.IRestResponse<BiterQueryResult> = await restc.get<BiterQueryResult>('/api2/1/ticker/' + content + '_cny');
        console.log(res);
        console.log(res.result);
        if (res.statusCode != 200 || res.result.result == "false") {
            return;
        }
        console.log(new Date().toString());
        let date = new Date().toLocaleTimeString("zh-cn", { timeZone: "Asia/Shanghai", hour12: false });
        let room = message.room();
        let contentStr:string = `【比特儿】${content} 当前交易价格：¥${res.result.last} 涨幅：${res.result.percentChange.toPrecision(4)} 时间:${date}`;
        if (room != null) {
            room.say(contentStr)
        } else {
            message.from().say(contentStr);
        }

    })
    .init()

class BiterQueryResult {
    result: string
    last: number
    percentChange: number
    code: number
}

