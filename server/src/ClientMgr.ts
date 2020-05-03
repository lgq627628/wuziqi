import Client from "./Client"
import GameMgr from "./GameMgr"

export default class ClientMgr {
  private static _instance: ClientMgr
  allClientArr: Client[] = []
  matchingClientArr: Client[] = []

  static getInstance() {
    return ClientMgr._instance || (ClientMgr._instance = new ClientMgr())
  }

  addClient(client: Client) {
    let idx = this.allClientArr.findIndex(c => c.uid === client.uid)
    if (idx < 0) this.allClientArr.push(client)
  }

  removeClient(client: Client) {
    let idx = this.allClientArr.indexOf(client)
    if (idx >= 0) this.allClientArr.splice(idx, 1)

    idx = this.matchingClientArr.indexOf(client)
    if (idx >= 0) this.matchingClientArr.splice(idx, 1)
  }

  match(client: Client) {
    if (this.matchingClientArr.length) {
      // 相互匹配
      let rival = this.matchingClientArr.shift()
      GameMgr.getInstance(GameMgr).addGame(client, rival)
    } else {
      console.log('当前暂无可匹配的客户端')
      this.matchingClientArr.push(client)
    }
  }
}
