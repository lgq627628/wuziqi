import Single from "./Single";
import Client from "./Client";
import GameData from "./GameData";
import { MessageS2C_Login, MsgSync } from "./Message";

export default class GameMgr extends Single<GameMgr> {

  allGames: GameData[] = []

  addGame(client: Client, rival: Client) {
    let gameData = new GameData(client, rival)
    this.allGames.push(gameData)
  }

  removeGame(gameData: GameData) {
    let idx = this.allGames.indexOf(gameData)
    if (idx >= 0) this.allGames.splice(idx, 1)
  }

  checkIsInGame(uid: string, data: MessageS2C_Login, client: Client): boolean {
    this.allGames.forEach(game => {
      if (game.disconnectUid === uid) {
        let sync = new MsgSync()
        sync.myUid = uid
        sync.otherUid = game.clientArr[0].uid
        sync.panelData = game.panelData
        sync.myChessType = game.getChessType()
        data.sync = sync
        game.reconnect(client)
        return true
      }
    })
    return false
  }
}
