const {ccclass, property} = cc._decorator;

@ccclass
export default class WS extends cc.Component {

    onLoad () {
      // let url = 'ws://127.0.0.1:7777'
      let url = 'ws://192.168.1.102:7777'
      let ws = new WebSocket(url)

      ws.onopen = (e: Event) => {
        ws.send('客服你好，我有事找你')
      }
      ws.onmessage = (e: Event) => {
        console.log('客户端收到了客服的消息', e)
      }
    }

    // update (dt) {}
}
