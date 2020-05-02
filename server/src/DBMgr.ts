import Single from "./Single";
import { MongoClient, MongoError, Db, Collection } from "mongodb";

export default class DBMgr extends Single<DBMgr> {

  db: Db
  userCollection: Collection

  connectDB() {
    let dbUrl = 'mongodb://localhost:27017'
    MongoClient.connect(dbUrl, (err: MongoError, rs: MongoClient) => {
      if (err) {
        console.log('链接数据库出错\n', err)
        return
      }
      console.log('连接数据库成功')
      this.db = rs.db('wuziqi')
      this.userCollection = this.db.collection('user')
      // wuziqi.collection('user').find().toArray((e: MongoError, rowData) => {
      //   if (e) {
      //     console.log('查找用户集合出错', e)
      //     return
      //   }
      //   console.log('用户集合查找结果如下：\n', rowData)
      //   rs.close() // 如果没有其他操作记得关闭
      // })
    })
  }

  static getDb(): Db {
    return DBMgr.getInstance(DBMgr).db
  }
  static getUserCollection(): Collection {
    return DBMgr.getInstance(DBMgr).userCollection
  }
}
