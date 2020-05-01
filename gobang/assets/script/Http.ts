const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    onLoad () {
      let xhr = cc.loader.getXMLHttpRequest()
      let url = 'http://www.baidu.com'
      xhr.open('GET', url, true)
      xhr.onreadystatechange = (e: Event): any => {
        if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
          let res = xhr.responseText
          console.log(res)
        }
      }
      xhr.send()
    }

    // update (dt) {}
}
