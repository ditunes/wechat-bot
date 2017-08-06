import {  Room, Message } from 'wechaty'
import {DEFAULT_ROOM_NAME} from './global';
export class RoomUtlils {
  public static alertRoomIlegalMsg : (room: Room, message: Message)=>void = (room,message)=>{
        if (message.content().match("美女|fuck|妈蛋|我操|傻逼")) {
            console.log(`非法用语:Message: ${message}`);
            room.say("您的言语中有包含非法词汇，请注意文明用语", message.from());
            //room.del(message.from());
        }
    }
  public static async saySomethingToDefaultRoom(msg:string) {
       Room.find({"topic":DEFAULT_ROOM_NAME}).then(item=>{
           if(item != null){
               item.say(msg);
           }
       });
        
  }
}