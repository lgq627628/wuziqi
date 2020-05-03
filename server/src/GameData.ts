import Client from "./Client";
import { MessageS2C_Match, MessageType, PutMessage } from "./Message";
import Config from "./Config";
import GameMgr from "./GameMgr";

export default class GameData{
  /** 玩家信息，可能有观战模式 */
  clientArr: Client[] = []
  /** 整个棋盘信息 */
  panelData: ChessData[][] = []
  /** 玩家和棋子的对应关系 */
  chessTypeMap: Map<string, ChessType> = new Map<string, ChessType>()
  lastChess: ChessData = null

  disconnectUid: string = null

  constructor(client: Client, rival: Client) {
    this.initPanel()
    this.initMatch(client, rival)
  }

  initPanel() {
    for (let i = 0; i < Config.ROW_COUNT; i++) {
      this.panelData[i] = []
      for (let j = 0; j < Config.COL_COUNT; j++) {
        let chessData = new ChessData()
        chessData.i = i
        chessData.j = j
        this.panelData[i][j] = chessData
      }
    }
  }

  initMatch(client: Client, rival: Client) {
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

    this.addClient(client, msg1.myChessType)
    this.addClient(rival, msg2.myChessType)
  }

  addClient(client: Client, chessType: ChessType) {
    client.gameData = this
    this.clientArr.push(client)
    this.chessTypeMap.set(client.uid, chessType)
  }

  onPut(msg: PutMessage) {
    this.clientArr.forEach(client => {
      client.send(msg)
    })
    let chess = this.panelData[msg.i][msg.j]
    chess.chessType = msg.chessType

    if (this.lastChess) this.lastChess.isLastedChess = false
    this.lastChess = chess
    this.lastChess.isLastedChess = true
  }

  disconnect(client: Client) {
    let idx = this.clientArr.indexOf(client)
    if (idx >= 0) this.clientArr.splice(idx, 1)

    this.chessTypeMap.delete(client.uid)
    this.disconnectUid = client.uid
    client.gameData = null // 及时回收

    if (this.clientArr.length === 0) { // 如果两人都掉线，直接移除整盘棋
      GameMgr.getInstance(GameMgr).removeGame(this)
    }
  }

  reconnect(client: Client) {
    this.addClient(client, this.getChessType())
  }
  /** 断线重连时获取棋子类型用的 */
  getChessType(): ChessType {
    let chessType = this.chessTypeMap.get(this.clientArr[0].uid)
    return chessType === ChessType.Black ? ChessType.White : ChessType.Black
  }
}

export class ChessData {
  chessType: ChessType = ChessType.None
  i: number
  j: number
  isLastedChess: boolean = false
}

export enum ChessType {
  None,
  Black,
  White
}
