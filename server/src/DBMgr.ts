import Single from "./Single";
import { MongoClient, MongoError, Db, Collection } from "mongodb";

export default class DBMgr extends Single<DBMgr> {

  /** 库名 */
  db: Db
  /** user 集合（表） */
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
    })
  }

  static getDb(): Db {
    return DBMgr.getInstance(DBMgr).db
  }
  static getUserCollection(): Collection {
    return DBMgr.getInstance(DBMgr).userCollection
  }
}
