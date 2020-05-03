import { ChessType, ChessData } from "../Chess";

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
  C2S_Match,
  S2C_Match,
  C2S_Put,
  S2C_Put,
  Exit
}

export class PutMessage extends Message {
  type: MessageType = MessageType.C2S_Put
  uid: string
  i: number
  j: number
  chessType: ChessType

  constructor(uid: string,i: number, j: number, chessType: ChessType) {
    super()
    this.uid = uid
    this.i = i
    this.j = j
    this.chessType = chessType
  }
}

export class MessageC2S_Regist extends MessageC2S {
  type: MessageType = MessageType.C2S_Regist
  constructor(public username: string, public password: string) { // 加上 public 就相当于 this.username = username
    super()
  }
}

export class MessageS2C_Regist extends MessageS2C {
  type: MessageType = MessageType.S2C_Regist
}

export class MessageC2S_Login extends MessageC2S {
  type: MessageType = MessageType.C2S_Login
  constructor(public username: string, public password: string) {
    super()
  }
}

export class MessageS2C_Login extends MessageS2C {
  type: MessageType = MessageType.S2C_Login
  uid: string
  sync: MsgSync
}

export class MessageC2S_Match extends MessageC2S {
  type: MessageType = MessageType.C2S_Match
  uid: string
}

export class MessageS2C_Match extends MessageS2C {
  type: MessageType = MessageType.S2C_Match
  myUid: string
  otherUid: string
  myChessType: number
}

export class MsgSync {
  myUid: string
  otherUid: string
  myChessType: number
  panelData: ChessData[][] = []
}


export interface ISyncData {
  myUid: string
  otherUid: string
  myChessType: number
}
