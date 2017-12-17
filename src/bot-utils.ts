import {Message,Room} from "wechaty";
export class WeChatyApiX {
  public static isTalkingToMePrivately = function(m:Message):boolean {
   if(!m.rawObj){
     return false;
   }
    return m.rawObj['MMIsChatRoom'] == false; // consider add m.to().self()
  };

  public static isFromAdmin = function(m:Message) : boolean{
       if(WeChatyApiX.isTalkingToMePrivately(m)){
           console.log("alias:"+m.from().alias());
            return m.from().alias() == "admin";
       } 
       return false;
  }

  public static isPrivateTalkWithMe = function(m:Message):boolean{
       let receiver  =  m.to();
       if(receiver == null){
           return false;
       }
       console.log(receiver.name()+"|"+m.room()+"|"+receiver.self());
        return m.room() == null  && receiver.self();
  }

   public static getRoomByTopic = async function(topic:string) : Promise<Room|null>{
      let room =  await Room.find({"topic":topic});
      if(room != null){
        return room;
      }
      return null;
  }
}