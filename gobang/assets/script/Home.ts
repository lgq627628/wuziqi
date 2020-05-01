import Config from "./common/Config";
import Chess, { ChessData, ChessType } from "./Chess";
import Player from "./Player";
import EventCenter from "./common/EventCenter";
import EventName from "./common/EventName";
import WS from "./common/WS";
import { PutMessage, MatchMessage } from "./common/Message";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Home extends cc.Component {

    @property(cc.Node)
    chessWrap: cc.Node = null;
    @property(cc.Prefab)
    chessPrefab: cc.Prefab = null;
    @property(cc.Label)
    tip: cc.Label = null;

    chessArr: Chess[][] = []
    chessDataArr: ChessData[][] = []

    lastedChess: Chess = null

    p1: Player = null
    p2: Player = null
    curPlayer: Player = null

    onLoad () {
      this.genChessPanel()
      EventCenter.on(EventName.EVENT_MATCH_OK, this.onMatchOK, this)
      EventCenter.on(EventName.EVENT_PUT, this.onPutMsg, this)
    }

    onMatchOK(msg: MatchMessage) {
      console.log('匹配成功')
      let {myUid, otherUid, myChessType} = msg
      let p1 = new Player()
      p1.uid = myUid
      p1.name = '我'
      p1.type = myChessType
      this.p1 = p1

      let p2 = new Player()
      p2.uid = otherUid
      p2.name = '对手'
      p2.type = myChessType === ChessType.White ? ChessType.Black : ChessType.White
      this.p2 = p2

      this.curPlayer = myChessType === ChessType.Black ? this.p1 : this.p2
      this.updateRoundTip()
    }

    turnPlayer(uid: number) {
      if (this.p1.uid === uid) {
        this.curPlayer = this.p2
      } else {
        this.curPlayer = this.p1
      }
    }

    genChessPanel() {
      for (let i = 0; i < Config.ROW_COUNT; i++) {
        this.chessArr[i] = []
        this.chessDataArr[i] = []
        for (let j = 0; j < Config.COL_COUNT; j++) {
          let chessData = new ChessData()
          chessData.i = i
          chessData.j = j
          this.chessDataArr[i][j] = chessData

          let chess = cc.instantiate(this.chessPrefab).getComponent(Chess)
          this.chessWrap.addChild(chess.node)
          chess.node.x = (i - Math.floor(Config.COL_COUNT / 2)) * Config.CHESS_SIZE
          chess.node.y = (j - Math.floor(Config.ROW_COUNT / 2)) * Config.CHESS_SIZE
          chess.chessData = chessData
          chess.home = this
          chess.updateState()
          this.chessArr[i][j] = chess
        }
      }
    }

    sendPutMsg(i: number, j: number) {
      if (!this.curPlayer) return
      if (this.chessDataArr[i][j].type !== ChessType.None) return

      // 如果当前落子的是自己，则发送消息到服务端告知
      if (this.curPlayer === this.p1) {
        let msg = new PutMessage(this.curPlayer.uid, i, j)
        WS.getInstance().send(msg)
      }
      this.curPlayer = null
    }

    onPutMsg(msg: PutMessage) {
      let {uid, i, j} = msg
      let player = this.getPlayer(uid)

      this.putChess(player.type, i, j)
      this.checkWin(i, j, player.type) && this.scheduleOnce(() => {alert('win')}, 0)
      this.turnPlayer(uid)
      this.updateRoundTip()
    }

    getPlayer(uid) {
      return this.p1.uid === uid ? this.p1 : this.p2
    }

    putChess(type: ChessType, i: number, j: number) {
      this.chessDataArr[i][j].type = type
      this.chessDataArr[i][j].isLastedChess = true
      this.chessArr[i][j].updateState()

      if (this.lastedChess) {
        this.lastedChess.chessData.isLastedChess = false
        this.lastedChess.updateState()
      }

      this.lastedChess = this.chessArr[i][j]
    }

    checkWin(i: number, j: number, type: ChessType): boolean {
      let rs = this.checkH(i, j, type) || this.checkV(i, j, type) || this.checkO1(i, j, type) || this.checkO2(i, j, type)
      return rs
    }
    checkH(i: number, j: number, type: ChessType): boolean {
      let num = 1
      let temp = j
      while(--temp > 0) {
        if (this.chessDataArr[i][temp].type === type) {
          num++
        } else {
          break
        }
      }
      temp = j
      while(++temp < Config.COL_COUNT) {
        if (this.chessDataArr[i][temp].type === type) {
          num++
        } else {
          break
        }
      }
      return num >= 5
    }
    checkV(i: number, j: number, type: ChessType): boolean {
      let num = 1
      let temp = i
      while(--temp > 0) {
        if (this.chessDataArr[temp][j].type === type) {
          num++
        } else {
          break
        }
      }
      temp = i
      while(++temp < Config.ROW_COUNT) {
        if (this.chessDataArr[temp][j].type === type) {
          num++
        } else {
          break
        }
      }
      return num >= 5
    }
    checkO1(i: number, j: number, type: ChessType): boolean {
      let num = 1
      let tempI = i
      let tempJ = j
      while(tempI--, tempJ--, tempI >= 0 && tempJ >= 0) {
        if (this.chessDataArr[tempI][tempJ].type === type) {
          num++
        } else {
          break
        }
      }
      tempI = i
      tempJ = j
      while(tempI++, tempJ++, tempI < Config.ROW_COUNT && tempJ < Config.ROW_COUNT) {
        if (this.chessDataArr[tempI][tempJ].type === type) {
          num++
        } else {
          break
        }
      }
      return num >= 5
    }
    checkO2(i: number, j: number, type: ChessType): boolean {
      let num = 1
      let tempI = i
      let tempJ = j
      while(tempI--, tempJ++, tempI >= 0 && tempJ < Config.COL_COUNT) {
        if (this.chessDataArr[tempI][tempJ].type === type) {
          num++
        } else {
          break
        }
      }
      tempI = i
      tempJ = j
      while(tempI++, tempJ--, tempI < Config.ROW_COUNT && tempJ >= 0) {
        if (this.chessDataArr[tempI][tempJ].type === type) {
          num++
        } else {
          break
        }
      }
      return num >= 5
    }

    updateRoundTip() {
      this.tip.string = `轮到 ${this.curPlayer === this.p1 ? this.p1.name : this.p2.name} 落子啦`
    }
}
