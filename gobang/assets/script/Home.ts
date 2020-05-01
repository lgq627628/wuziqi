import Config from "./Config";
import Chess, { ChessData, ChessType } from "./Chess";
import Player from "./Player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Home extends cc.Component {

    @property(cc.Node)
    chessWrap: cc.Node = null;
    @property(cc.Prefab)
    chessPrefab: cc.Prefab = null;

    chessArr: Chess[][] = []
    chessDataArr: ChessData[][] = []

    lastedChess: Chess = null

    p1: Player = null
    p2: Player = null
    curPlayer: Player = null

    onLoad () {
      this.genChessPanel()
      this.genTwoPlayer()
    }

    genTwoPlayer() {
      let p1 = new Player()
      p1.uid = 1
      p1.type = ChessType.Black
      this.p1 = p1

      let p2 = new Player()
      p2.uid = 1
      p2.type = ChessType.White
      this.p2 = p2

      this.curPlayer = p1
    }

    turnPlayer() {
      if (this.curPlayer === this.p1) {
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

    putChess(i: number, j: number) {
      if (this.chessDataArr[i][j].type !== ChessType.None) return

      this.chessDataArr[i][j].type = this.curPlayer.type
      this.chessDataArr[i][j].isLastedChess = true
      this.chessArr[i][j].updateState()

      if (this.lastedChess) {
        this.lastedChess.chessData.isLastedChess = false
        this.lastedChess.updateState()
      }

      this.lastedChess = this.chessArr[i][j]

      if (this.checkWin(i, j, this.curPlayer.type)) {
        this.scheduleOnce(() => {alert('win')}, 0)

      }
      this.turnPlayer()
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
}
