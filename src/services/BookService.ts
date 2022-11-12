
import Book from '../dto/Book'
import fs from 'fs'

export default class BookService {

  public async getBookList(): Promise<Book[]> {
    const urlList = await fs.promises.readdir('C:/Users/chenj/iCloudDrive/ebook')
    return urlList.map(v =>{
      return <Book>
      {
      name: v,
      phyLoc: v
    }})
  }
}
