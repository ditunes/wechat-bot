import { Room } from 'wechaty';

let ROOM_LIST: Room[] = [];

let isBotMode = true;

export function getAllRoom(): Room[] {
    return ROOM_LIST;
}

export function setAllRoom(roomList: Room[]): void {
    ROOM_LIST = roomList;
}

export function refreshRoomList() {
    Room.findAll().then(item => {
        setAllRoom(item);
    }).catch((error) => {
        console.log(error);
    });
}

export let BOT_MODE = {
    humanMode: () => {
        isBotMode = false;
    },
    botMode: () => {
        isBotMode = true;
    },
    isBotMode: () => {
        return isBotMode;
    }


}