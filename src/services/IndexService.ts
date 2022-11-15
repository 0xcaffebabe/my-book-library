import ConfigService from "./ConfigService";
import fs from 'fs'
import BookDTO from "../dto/BookDTO";
import StoreService from "./StoreService";
import { DataType } from "enums/DataType";
import BookService from "./BookService";

export default class IndexService {

  private static instance: IndexService;
  private configService = ConfigService.newInstance()
  private storeService = StoreService.newInstance()
  private bookService = BookService.newInstance()

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
        return <BookDTO>{
          id: filename,
          name: filename,
          thumbnail: '',
          phyLoc: v
        }
      })
    await this.storeService.saveData(DataType.BOOK_LIST, JSON.stringify(bookList))
    console.log('书籍缩略图生成')
    for(const book of bookList) {
      if (book.name.endsWith(".pdf") || book.name.endsWith(".PDF")) {
        console.log("生成 " + book.name)
        await this.bookService.generateThumbnail(storeLoc + "/" + book.name)
      }
    }
  }

  public async getBookIndex(): Promise<BookDTO[]> {
    return this.storeService.getData(DataType.BOOK_LIST, '[]')
  }
}
