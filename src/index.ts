
import { FriendRequest } from 'wechaty/dist/src/friend-request';
<<<<<<< HEAD
import { Wechaty, Contact, Message } from 'wechaty'
import * as rm from 'typed-rest-client/RestClient'

const default_msg: string = "您可以输入币别进行查询当前行情如btc、eth";
var signal = {
    sig: 0,
    date: 1000,
    init: true
};
class CurrencyQueryInfo {
    queryName: string
    queryRegex: RegExp
    symbol: string
    constructor(queryName, symbol) {
        this.queryName = queryName;
        this.symbol = symbol;
        this.queryRegex = new RegExp(`${queryName}|${symbol}`, "i");
    }
}
let currencyList: CurrencyQueryInfo[] = [
    new CurrencyQueryInfo("Bitcoin", "BTC"),
    new CurrencyQueryInfo("Ethereum", "ETH"),
    new CurrencyQueryInfo("Ripple", "XRP"),
    new CurrencyQueryInfo("Litecoin", "LTC"),
    new CurrencyQueryInfo("ethereum-classic", "ETC"),
    new CurrencyQueryInfo("Dash", "DASH"),
    new CurrencyQueryInfo("NEM", "XEM"),
    new CurrencyQueryInfo("Monero", "XMR"),
    new CurrencyQueryInfo("IOTA", "MIOTA"),
    new CurrencyQueryInfo("BitConnect", "BCC"),
    new CurrencyQueryInfo("EOS", "EOS"),
    new CurrencyQueryInfo("Stratis", "STRAT"),
    new CurrencyQueryInfo("Tether", "USDT"),
    new CurrencyQueryInfo("BitShares", "BTS"),
    new CurrencyQueryInfo("Zcash", "ZEC"),
    new CurrencyQueryInfo("AntShares", "ANS"),
    new CurrencyQueryInfo("Bytecoin", "BCN"),
    new CurrencyQueryInfo("Steem", "STEEM"),
    new CurrencyQueryInfo("Qtum", "QTUM"),
    new CurrencyQueryInfo("Veritaseum", "VERI"),
    new CurrencyQueryInfo("Augur", "REP"),
    new CurrencyQueryInfo("Waves", "WAVES"),
    new CurrencyQueryInfo("Golem", "GNT"),
    new CurrencyQueryInfo("Siacoin", "SC"),
    new CurrencyQueryInfo("Gnosis", "GNO"),
    new CurrencyQueryInfo("stellar", "XLM"),
    new CurrencyQueryInfo("Dogecoin", "DOGE"),
    new CurrencyQueryInfo("Lisk", "LSK"),
    new CurrencyQueryInfo("Iconomi", "ICN"),
    new CurrencyQueryInfo("Byteball", "GBYTE"),
    new CurrencyQueryInfo("MaidSafeCoin", "MAID"),
    new CurrencyQueryInfo("Factom", "FCT"),
    new CurrencyQueryInfo("MCAP", "MCAP"),
    new CurrencyQueryInfo("Decred", "DCR"),
    new CurrencyQueryInfo("DigixDAO", "DGD"),
    new CurrencyQueryInfo("DigiByte", "DGB"),
    new CurrencyQueryInfo("Status", "SNT"),
    new CurrencyQueryInfo("GameCredits", "GAME"),
    new CurrencyQueryInfo("FirstBlood", "1ST"),
    new CurrencyQueryInfo("basic-attention-token", "BAT"),
    new CurrencyQueryInfo("PIVX", "PIVX"),
    new CurrencyQueryInfo("Ardor", "ARDR"),
    new CurrencyQueryInfo("Komodo", "KMD"),
    new CurrencyQueryInfo("Bancor", "BNT"),
    new CurrencyQueryInfo("Nxt", "NXT"),
    new CurrencyQueryInfo("TenX", "PAY"),
    new CurrencyQueryInfo("Populous", "PPT"),
    new CurrencyQueryInfo("Aragon", "ANT"),
    new CurrencyQueryInfo("SingularDTV", "SNGLS"),
    new CurrencyQueryInfo("Metal", "MTL"),
    new CurrencyQueryInfo("MobileGo", "MGO"),
    new CurrencyQueryInfo("BitcoinDark", "BTCD"),
    new CurrencyQueryInfo("LEOcoin", "LEO"),
    new CurrencyQueryInfo("DECENT", "DCT"),
    new CurrencyQueryInfo("Lykke", "LKK"),
    new CurrencyQueryInfo("FunFair", "FUN"),
    new CurrencyQueryInfo("Peercoin", "PPC"),
    new CurrencyQueryInfo("Ark", "ARK"),
    new CurrencyQueryInfo("SysCoin", "SYS"),
    new CurrencyQueryInfo("Nexus", "NXS"),
    new CurrencyQueryInfo("Round", "ROUND"),
    new CurrencyQueryInfo("Emercoin", "EMC"),
    new CurrencyQueryInfo("Edgeless", "EDG"),
    new CurrencyQueryInfo("ChainCoin", "CHC"),
    new CurrencyQueryInfo("Verge", "XVG"),
    new CurrencyQueryInfo("ReddCoin", "RDD"),
    new CurrencyQueryInfo("Xaurum", "XAUR"),
    new CurrencyQueryInfo("Etheroll", "DICE"),
    new CurrencyQueryInfo("Ubiq", "UBQ"),
    new CurrencyQueryInfo("Numeraire", "NMR"),
    new CurrencyQueryInfo("Asch", "XAS"),
    new CurrencyQueryInfo("Namecoin", "NMC"),
    new CurrencyQueryInfo("Peerplays", "PPY"),
    new CurrencyQueryInfo("Gulden", "NLG"),
    new CurrencyQueryInfo("Melon", "MLN"),
    new CurrencyQueryInfo("Soarcoin", "SOAR"),
    new CurrencyQueryInfo("e-dinar-coin", "EDR"),
    //new CurrencyQueryInfo("iExec RLC","RLC"),
    new CurrencyQueryInfo("Wings", "WINGS"),
    new CurrencyQueryInfo("MonaCoin", "MONA"),
    new CurrencyQueryInfo("CloakCoin", "CLOAK"),
    new CurrencyQueryInfo("Storjcoin X", "SJCX"),
    new CurrencyQueryInfo("SIBCoin", "SIB"),
    new CurrencyQueryInfo("Skycoin", "SKY"),
    new CurrencyQueryInfo("quantum-resistant-ledger", "QRL"),
    new CurrencyQueryInfo("Storj", "STORJ"),
    new CurrencyQueryInfo("Blocknet", "BLOCK"),
    new CurrencyQueryInfo("Quantum", "QAU"),
    new CurrencyQueryInfo("Counterparty", "XCP"),
    new CurrencyQueryInfo("library-credit", "LBC"),
    new CurrencyQueryInfo("Omni", "OMNI"),
    new CurrencyQueryInfo("Humaniq", "HMQ"),
    new CurrencyQueryInfo("vSlice", "VSL"),
    new CurrencyQueryInfo("BitBay", "BAY"),
    new CurrencyQueryInfo("OBITS", "OBITS"),
    new CurrencyQueryInfo("YbCoin", "YBC"),
    new CurrencyQueryInfo("ZCoin", "XZC"),
    new CurrencyQueryInfo("FairCoin", "FAIR"),
    new CurrencyQueryInfo("Crown", "CRW"),
    new CurrencyQueryInfo("adToken", "ADT"),
    new CurrencyQueryInfo("OmiseGo", "omg")
];

async function timeout(time: Number) {
    return new Promise(resolve => setTimeout(resolve, time));
}

=======
import { Wechaty, Contact, Room, Message } from 'wechaty'
import {BOT_NAME} from "./global";
import {DEFAULT_ROOM_NAME} from "./global";
import {BOT_MSG_PROC} from "./BotMsgProcessor";
const roomName: string = DEFAULT_ROOM_NAME;
const noticeStrInSingle: string = `hello，我是${BOT_NAME}很高兴认识你，我已经邀请你进入群：${roomName}`
const inRoomNotice: string = "如果没有成功邀请您入群，您也可以回复 aha\n我会马上拉你入群！aha"
>>>>>>> master-aha
Wechaty.instance() // Singleton
    .on('scan', async (url, code) => {
        let loginUrl = url.replace('qrcode', 'l')

        require('qrcode-terminal').generate(loginUrl)
        console.log(url)
    })
    .on('login', async (user) => { 
        console.log(`User ${user} logined`)
<<<<<<< HEAD

=======
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
>>>>>>> master-aha
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
<<<<<<< HEAD
        newFriend.say(default_msg);
    }).on('message', async (message: Message) => {
        if (message.from().self()) {
            return;
        }
        let userAgent = 'User-Agent:Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N)'
            + 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36'

        let restc: rm.RestClient = new rm.RestClient(userAgent,
            'https://api.coinmarketcap.com');
        let content = message.content().trim();
        console.log("receive :" + content);

        if (!/^\w+$/.test(content)) {
            return;
        }

        let queryInfo = currencyList.find(item => {
            return item.queryRegex.test(content);
        })
        if (queryInfo == null) {
            return;
        }
        content = queryInfo.queryName;
        console.log(`query : ${content}`)
        let res: rm.IRestResponse<BiterQueryResult[] | Error> = await restc.get<BiterQueryResult[] | Error>('/v1/ticker/' + content + '/?convert=CNY');
        // console.log(res);
        // console.log(res.result);

        if (res.statusCode != 200 || res.result instanceof Error) {
            return;
        }
        let date = new Date(res.result[0].last_updated * 1000).toLocaleTimeString("zh-cn", { timeZone: "Asia/Shanghai", hour12: false });
        console.log(date)
        let room = message.room();
        let price = Number.parseFloat(res.result[0].price_cny).toFixed(2);
        let contentStr: string = `【${res.result[0].name}-${res.result[0].symbol}】\n` + `全球币价：¥${price}\n`
            + `涨跌幅度：${res.result[0].percent_change_1h}% \n` +
            `更新时间：${date}`
        if (room != null) {
            getLock(() => {
                try {
                    if (room == null) return;
                    console.log("say time" + new Date())
                    room.say(contentStr)
                } catch(error){
                    unLock();
                }
            });


        } else {
            getLock(() => {
                try {
                    console.log("say time" + new Date())
                    message.from().say(contentStr);
                    unLock();
                } finally {
                    unLock();
                }
            })

        }

    })
    .init()



async function getLock(handler: Function) {
    if (signal.init && (signal.init = false)) {
        signal.date = new Date().getTime();
        signal.sig = 1;
        console.log("init get lock");
        handler.apply(this);
    } else {
        while (signal.sig == 1) {
            await timeout(2000);
            console.log("wait lock");
        }
        signal.sig = 1;
        console.log("get lock");
        if (Date.now() - signal.date < 5000) {
            await timeout(10000);
        }
        handler.apply(this);
    }
}

async function unLock() {
    signal.init = false;
    signal.date = Date.now();
    signal.sig = 0;
}

=======
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
>>>>>>> master-aha

class BiterQueryResult {
    error: string | null;
    id: string;
    name: string;
    symbol: string;
    price_cny: string;
    percent_change_1h: number;
    market_cap_cny: number;
    last_updated: number
}
<<<<<<< HEAD
class Error {
    error: string
}





=======

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
>>>>>>> master-aha
