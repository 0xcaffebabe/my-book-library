
import Book from '../dto/Book'
import fs from 'fs'
import StoreService from './StoreService'
import { DataType } from 'enums/DataType'

export default class BookService {

  private storeService = StoreService.newInstance()

  public async getBookList(): Promise<Book[]> {
    return this.storeService.getData(DataType.BOOK_LIST, '[]')
  }
}
