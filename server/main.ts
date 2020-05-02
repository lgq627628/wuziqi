import WebSocket from 'ws'
import http from 'http'
import Client from './src/Client'
import ClientMgr from './src/ClientMgr'
import DBMgr from './src/DBMgr'

DBMgr.getInstance(DBMgr).connectDB() // 最好等回调之后再开启服务器

let ws = new WebSocket.Server({port: 7777})
ws.on('connection', (socket: WebSocket, request: http.IncomingMessage) => {
  // ws 相当于一个管理者，好比客服总经理，socket 相当于下属，就是每个客服
  console.log('--- ws 服务端收到了一个客户端链接 ---')
  let client = new Client(socket)
  ClientMgr.getInstance().addClient(client)
})

console.log('❤  ws 服务端已开启 ❤')
