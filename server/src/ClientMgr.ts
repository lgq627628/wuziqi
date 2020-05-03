import Client from "./Client"
import { MessageType, MessageS2C_Match } from "./Message"

export default class ClientMgr {
  private static _instance: ClientMgr
  allClientArr: Client[] = []
  matchingClientArr: Client[] = []

  static getInstance() {
    return ClientMgr._instance || (ClientMgr._instance = new ClientMgr())
  }

  addClient(client: Client) {
    this.allClientArr.push(client)
  }

  match(client: Client) {
    if (this.matchingClientArr.length) {
      // 相互匹配
      let rival = this.matchingClientArr.shift()
      client.matchClient = rival
      rival.matchClient = client

      let msg1 = new MessageS2C_Match()
      msg1.type = MessageType.S2C_Match
      msg1.myUid = client.uid
      msg1.otherUid = rival.uid
      msg1.myChessType = Math.random() > 0.5 ? 1 : 2

      let msg2 = new MessageS2C_Match()
      msg2.type = MessageType.S2C_Match
      msg2.myUid = rival.uid
      msg2.otherUid = client.uid
      msg2.myChessType = msg1.myChessType === 1 ? 2 : 1

      client.send(msg1)
      rival.send(msg2)
    } else {
      console.log('当前暂无可匹配的客户端')
      this.matchingClientArr.push(client)
    }
  }
}
