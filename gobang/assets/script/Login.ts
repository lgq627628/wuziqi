import EventCenter from "./common/EventCenter";
import EventName from "./common/EventName";
import { MessageC2S_Regist, MessageS2C_Regist, MessageType } from "./common/Message";
import WS from "./common/WS";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.EditBox)
    username: cc.EditBox = null
    @property(cc.EditBox)
    password: cc.EditBox = null
    @property(cc.Label)
    tip: cc.Label = null

    onLoad () {
      EventCenter.on(EventName.EVENT_CONNECT_OK, this.onConnectOK, this)
      EventCenter.on(MessageType.S2C_Regist.toString(), this.onRegistCb, this)
    }

    onRegistCb(msg: MessageS2C_Regist) {
      let code = msg.code
      if (code === 0) {
        this.tip.string = '注册成功'
      } else if (code === -1) {
        this.tip.string = '用户名已存在'
      } else {
        this.tip.string = '网络错误'
      }
    }

    onConnectOK() {
      this.regist()
    }

    regist() {
      let username = this.username.string
      let password = this.password.string
      let data = new MessageC2S_Regist(username, password)
      WS.getInstance().send(data)
    }

    onClickLogin() {

    }

    onClickRegist() {
      WS.getInstance().connect()
    }

    onDestroy() {
      EventCenter.off(EventName.EVENT_CONNECT_OK, this.onConnectOK, this)
      EventCenter.off(MessageType.S2C_Regist.toString(), this.onRegistCb, this)
    }

    // update (dt) {}
}
