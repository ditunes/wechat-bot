
export const BOT_NAME = "AHA侦探社";
export const DEFAULT_ROOM_NAME = "AHA季东来故事高手";
export const NEW_FRIEND_WECLOME_TEMPLATE = "hello，我是${BOT_NAME}很高兴认识你，我已经邀请你进入活动群：${DEFAULT_ROOM_NAME}！";

export const ROOM_LIST = {
    "aha": DEFAULT_ROOM_NAME
}
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