class EventHandler {
  target: object
  fn: Function
  constructor(target: object, fn: Function) {
      this.target = target
      this.fn = fn
  }
}

export default class EventCenter {
  private static eventMap: object = {}
  // private static eventMap: Map<string, Array<EventHandler>> = new Map<string, Array<EventHandler>>()
  /**
   * 注册事件
   * @param {string} eventName 事件名
   * @param {Function} fn 注册的函数
   * @param {object} target 注册的对象
   */
  static on(eventName: string, fn: Function, target: object) {
      if (eventName == null || target == null || fn == null) throw Error('注册事件的参数有误')
      if (!EventCenter.eventMap[eventName]) EventCenter.eventMap[eventName] = []
      EventCenter.eventMap[eventName].push(new EventHandler(target, fn))
  }
  /**
   * 移除事件
   * @param {string} eventName 事件名
   * @param {Function} fn 注册的函数
   * @param {object} target 注册的对象
   */
  static off(eventName: string, fn: Function, target: object) {
      let events = EventCenter.eventMap[eventName]
      if (events && events.length) {
          events.forEach((e, i) => {
              if (e.fn === fn && e.target === target) events[i] = null
          })
          // EventCenter.eventMap[eventName] = events.filter(e => e)
      } else {
          events = null
      }
  }
  /**
   * 触发事件
   * @param {string} eventName  事件名
   * @param {any} data 要传递的数据
   */
  static emit(eventName: string, data?: any) {
      let events = EventCenter.eventMap[eventName]
      events && events.length && events.forEach((e: EventHandler) => {
          try {
              // 你执行的函数可能出错，所以要加上捕获，在浏览器是捕获得到的，在 Android 和 IOS 就不一定了
              // 另外 e 可能为空，因为在解绑的时候置为空了
              e && e.fn.call(e.target, data)
          } catch (err) {
              console.log(err)
          }
      });
  }
}
