import Client from "./Client"
import { MatchMessage, MessageType } from "./Message"

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

      let uid1 = 1000
      let uid2 = 2000

      let msg1 = new MatchMessage()
      msg1.type = MessageType.S2C_MatchOK
      msg1.myUid = uid1
      msg1.otherUid = uid2
      msg1.myChessType = Math.random() > 0.5 ? 1 : 2

      let msg2 = new MatchMessage()
      msg2.type = MessageType.S2C_MatchOK
      msg2.myUid = uid2
      msg2.otherUid = uid1
      msg2.myChessType = msg1.myChessType === 1 ? 2 : 1

      client.send(msg1)
      rival.send(msg2)
    } else {
      console.log('当前暂无可匹配的客户端')
      this.matchingClientArr.push(client)
    }
  }
}
