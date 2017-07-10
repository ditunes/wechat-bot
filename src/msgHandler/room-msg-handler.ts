import { BotMsgHandler } from './msg-handler';
import { Wechaty, Contact, Room, Message } from 'wechaty';
interface RoomMsgHandler extends BotMsgHandler{
    roomName:string
    room: Room;
}

