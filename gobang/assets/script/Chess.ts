import Home from "./Home";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Chess extends cc.Component {

    @property(cc.Node)
    blackChess: cc.Node = null;
    @property(cc.Node)
    whiteChess: cc.Node = null;
    @property(cc.Node)
    redPoint: cc.Node = null;

    chessData: ChessData = null

    home: Home = null

    onLoad () {
      this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
    }

    onTouchStart() {
      this.home.sendPutMsg(this.chessData.i, this.chessData.j)

    }
    updateState() {
      this.blackChess.active = this.chessData.chessType === ChessType.Black
      this.whiteChess.active = this.chessData.chessType === ChessType.White
      this.redPoint.active = this.chessData.isLastedChess
    }

    // update (dt) {}
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
