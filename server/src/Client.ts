import WebSocket from 'ws'
import Message, { MessageType } from './Message'
import ClientMgr from './ClientMgr'

export default class Client {

  socket: WebSocket
  matchClient: Client

  constructor(socket: WebSocket) {
    this.socket = socket
    socket.on('message', this.onMessage.bind(this)) // 记得作用域绑定
  }

  onMessage(data: WebSocket.Data) {
    console.log('服务端收到了如下消息：')
    let msg = JSON.parse(data as string) as Message
    switch (msg.type) {
      case MessageType.C2S_Put:
        console.log(msg)
        msg.type = MessageType.S2C_Put
        this.send(msg)
        this.matchClient.send(msg)
        break;
      case MessageType.Match:
        console.log('收到了来自客户端的匹配请求')
        ClientMgr.getInstance().match(this)
        break;
    }
  }

  send(msg: Message) {
    this.socket.send(JSON.stringify(msg))
  }
}
