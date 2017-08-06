import { Room, Contact } from 'wechaty';
var signal = {
    sig: 0,
    date: 1000,
    init: true
};

export function sayToRoom(room: Room, str: string): void {
    getLock(() => {
        console.log("say " + str + " to perosn[" + room.topic() + "]");
        room.say(str);
        unLock();
    })
    return;
}
export function sayToContact(contact: Contact, str: string): void {
    getLock(() => {
        console.log("say " + str + " to perosn[" + contact.name() + "]");
        contact.say(str);
        unLock();
    }).catch((error) => {
        console.log(error);
    })
    return;
}

async function timeout(time: Number) {
    return new Promise(resolve => setTimeout(resolve, time));
}


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