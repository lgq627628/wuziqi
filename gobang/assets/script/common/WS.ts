import Message, { MessageType } from "./Message";
import EventCenter from "./EventCenter";
import EventName from "./EventName";

const {ccclass, property} = cc._decorator;
@ccclass
export default class WS extends cc.Component {

    private static _instance: WS = null
    ws: WebSocket

    static getInstance() {
      return WS._instance
    }

    onLoad () {
      WS._instance = this
      cc.game.addPersistRootNode(this.node)
    }

    connect() {
      let url = 'ws://127.0.0.1:7777'
      // let url = 'ws://192.168.1.102:7777'
      let ws = new WebSocket(url)
      ws.onopen = (e: MessageEvent) => {
        console.log('客户端开始连接 ws 服务端')
        // ws.send(JSON.stringify({type: 1}))
        EventCenter.emit(EventName.EVENT_CONNECT_OK)
      }
      ws.onmessage = (e: MessageEvent) => {
        console.log('客户端收到了 ws 服务端的消息', e.data)
        let msg = JSON.parse(e.data) as Message

        switch (msg.type) {
          case MessageType.S2C_Match:
            EventCenter.emit(msg.type.toString(), msg)
            break
          case MessageType.S2C_Put:
            EventCenter.emit(EventName.EVENT_PUT, msg)
            break
          case MessageType.S2C_Regist:
            EventCenter.emit(msg.type.toString(), msg)
            break
          case MessageType.S2C_Login:
            EventCenter.emit(msg.type.toString(), msg)
            break
        }
      }
      this.ws = ws
    }

    send(msg: Message) {
      this.ws.send(JSON.stringify(msg))
    }
}
