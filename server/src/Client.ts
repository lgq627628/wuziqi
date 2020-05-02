import WebSocket from 'ws'
import {v1} from 'uuid'
import Message, { MessageType, MessageC2S_Regist, MessageS2C_Regist, MessageC2S_Login, MessageS2C_Login } from './Message'
import ClientMgr from './ClientMgr'
import DBMgr from './DBMgr'
import {Md5} from 'ts-md5'

export default class Client {

  socket: WebSocket
  matchClient: Client
  uid: string

  constructor(socket: WebSocket) {
    this.socket = socket
    socket.on('message', this.onMessage.bind(this)) // 记得作用域绑定
  }

  onMessage(data: WebSocket.Data) {
    let msg = JSON.parse(data as string) as Message
    switch (msg.type) {
      case MessageType.C2S_Put:
        console.log('收到了客户端的--落子--请求')
        msg.type = MessageType.S2C_Put
        this.send(msg)
        this.matchClient.send(msg)
        break;
      case MessageType.Match:
        console.log('收到了客户端的--匹配--请求')
        ClientMgr.getInstance().match(this)
        break;
      case MessageType.C2S_Regist:
        console.log('收到了客户端的--注册--请求')
        let regist = msg as MessageC2S_Regist
        let username = regist.username
        DBMgr.getUserCollection().find({username}).toArray((err, res: []) => {
          let data = new MessageS2C_Regist()
          if (err) {
            data.code = -10
            this.send(data)
          } else if (res.length) {
            data.code = -1
            this.send(data)
          } else {
            let uid = v1() // v1 指的是根据网卡的 Mac 地址和时间戳返回一个字符串
            let password = Md5.hashStr(regist.password)
            let doc = {uid, username, password}
            console.log('当前注册用户信息', doc)
            DBMgr.getUserCollection().insertOne(doc, (err, rs) => {
              if (err) throw err
              data.code = 0
              this.send(data)
            })
          }
        })
        break;
      case MessageType.C2S_Login:
        console.log('收到了客户端的--登入--请求')
        let login = msg as MessageC2S_Login
        console.log(login)
        DBMgr.getUserCollection().findOne({username: login.username, password: Md5.hashStr(login.password)}, (err, res: MessageS2C_Login) => {
          let data = new MessageS2C_Login()
          if (err) {
            data.code = -10
          } else if (res) {
            data.code = 0
            data.uid = res.uid
            this.uid = res.uid
          } else {
            data.code = -1
          }
          this.send(data)
        })
        break;
    }
  }

  send(msg: Message) {
    this.socket.send(JSON.stringify(msg))
  }
}
