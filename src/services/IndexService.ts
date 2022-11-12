import ConfigService from "./ConfigService";
import fs from 'fs'
import Book from "../dto/Book";
import StoreService from "./StoreService";
import { DataType } from "enums/DataType";

export default class IndexService {

  private static instance: IndexService;
  private configService = ConfigService.newInstance()
  private storeService = StoreService.newInstance()

  private constructor(){}

  public static newInstance():IndexService {
    return this.instance || (this.instance = new IndexService())
  }


  /**
   *
   * 生成书籍索引
   * @memberof IndexService
   */
  public async index() {
    const storeLoc = this.configService.getBaseStoreUrl()
    const bookList = (await fs.promises.readdir(storeLoc))
      .map(v => {
        const arr = v.split("/")
        const filename = arr[arr.length - 1]
        return <Book>{
          id: filename,
          name: filename,
          thumbnail: '',
          phyLoc: v
        }
      })
    await this.storeService.saveData(DataType.BOOK_LIST, JSON.stringify(bookList))
  }

  public async getBookIndex(): Promise<Book[]> {
    return this.storeService.getData(DataType.BOOK_LIST, '[]')
  }
}
