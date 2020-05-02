export default class Message {
  type: MessageType
}

export class MessageS2C extends Message {
  code: number
}
export class MessageC2S extends Message {
}

export enum MessageType {
  C2S_Regist,
  C2S_Login,
  S2C_Regist,
  S2C_Login,
  Match,
  S2C_MatchOK,
  C2S_Put,
  S2C_Put,
  Exit
}

export class PutMessage extends Message {
  uid: number
  i: number
  j: number
  type: MessageType = MessageType.C2S_Put

  constructor(uid: number,i: number, j: number) {
    super()
    this.uid = uid
    this.i = i
    this.j = j
  }
}

export class MatchMessage extends Message {
  myUid: number
  otherUid: number
  myChessType: number
  type: MessageType = MessageType.S2C_MatchOK
}

export class MessageC2S_Regist extends MessageC2S {
  type: MessageType = MessageType.C2S_Regist
  constructor(public username: string, public password: string) { // 加上 public 就相当于 this.username = username
    super()
  }
}

export class MessageS2C_Regist extends MessageS2C {
}
