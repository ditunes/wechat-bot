
export const BOT_NAME = "D调的暖冬";
export const DEFAULT_ROOM_NAME = "AHA季东来故事高手";
export const NEW_FRIEND_WECLOME_TEMPLATE = "hello，我是${BOT_NAME}很高兴认识你，我已经邀请你进入群：${DEFAULT_ROOM_NAME} 5月18日20点我们将在此群和Ethan面对面，有想问的问题可以提前发给我哦.";
export const ROOM_LIST = {
    "aha": DEFAULT_ROOM_NAME
}
export const ADMIN_LIST = [
"D调的暖冬"
]
let isBotMode = true;
export let BOT_MODE ={
    humanMode : ()=>{
        isBotMode = false;
    },
    botMode :()=>{
        isBotMode = true;
    },
    isBotMode :()=>{
        return isBotMode;
    }


}