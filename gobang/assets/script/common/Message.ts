export default class Message {
  type: MessageType
}

export enum MessageType {
  Hello,
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
