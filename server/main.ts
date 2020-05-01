import * as WebSocket from 'ws'
import http from 'http'
let ws = new WebSocket.Server({port: 7777})

ws.on('connection', (socket: WebSocket, request: http.IncomingMessage) => {
  // ws 相当于一个管理者，好比客服总经理
  // socket 相当于下属，就是每个客服
  console.log('某个客服收到了一个链接')
  socket.send('客户端你好，我是本次和你对接的客服人员')
  socket.on('message', (data: WebSocket.Data) => {
    console.log(data)
  })
})
