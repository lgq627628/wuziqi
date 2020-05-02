export default class Single<T> {
  private static _instance = null

  static getInstance<T>(c: {new(): T}): T {
    return this._instance || (this._instance = new c()) // 为什么可以用 this，因为这是要作为基类共享的
  }
}
