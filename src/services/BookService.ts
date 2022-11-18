
import BookDTO from '@/dto/BookDTO'
import fs, { readlink } from 'fs'
import StoreService from 'services/StoreService'
import { DataType } from 'enums/DataType'
import ConfigService from './ConfigService'

import util from 'util';
import PathUtils from 'utils/PathUtils'
import StreamZip from 'node-stream-zip'


const exec = util.promisify(require('child_process').exec);

const EMPTY_BOOK: BookDTO = {
  name: 'unknow',
  id: 'unknow',
  phyLoc: '',
  thumbnail: ''
}

export default class BookService {

  private static instance:BookService

  private constructor() {}

  public static newInstance() {
    return this.instance || (this.instance = new BookService())
  }

  private storeService = StoreService.newInstance()
  private configService = ConfigService.newInstance()

  /**
   *
   * 生成书籍索引
   * @memberof IndexService
   */
   public async index(callback?: (currentBook: string, currentIndex: number, total: number) => void) {
    const storeLoc = this.configService.getBaseStoreUrl()
    const bookList = (await fs.promises.readdir(storeLoc))
      .filter(v => v.toUpperCase().indexOf("PDF") != -1 || v.toUpperCase().indexOf("EPUB") != -1)
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
    await this.storeService.saveData(DataType.BOOK_LIST, bookList)
    console.log('书籍缩略图生成')
    let cnt = 0
    for(const book of bookList) {
      console.log("生成 " + book.name)
      if (callback) {
        callback(book.name, ++cnt, bookList.length)
      }
      await this.generateThumbnail(storeLoc + "/" + book.name)
    }
  }


  /**
   *
   * 获取所有书籍列表
   * @return {*}  {Promise<BookDTO[]>}
   * @memberof BookService
   */
  public async getBookList(): Promise<BookDTO[]> {
    return this.storeService.getData(DataType.BOOK_LIST, '[]')
  }

  /**
   *
   * 添加书籍的阅读记录
   * @param {string} name
   * @memberof BookService
   */
  public async addReadingReacord(name: string) {
    let readingList = await this.storeService.getData(DataType.READING_RECORD, '[]') as string[]
    readingList = readingList.filter(v => v != name)
    readingList.unshift(name)
    await this.storeService.saveData(DataType.READING_RECORD, readingList)
  }

  /**
   *
   * 获取最近阅读的书籍列表
   * @return {*}  {Promise<BookDTO[]>}
   * @memberof BookService
   */
  public async getReadingRecord(): Promise<BookDTO[]> {
    const all = await this.getBookList()
    const map = new Map<string, BookDTO>(all.map(v => [v.name, v]))
    return (await this.storeService.getData(DataType.READING_RECORD, '[]') as string[])
          .map(v => map.get(v) || EMPTY_BOOK)
  }

  public generateBookThumbnailUrl(bookName: string) {
    bookName = PathUtils.normalize(bookName)
    const arr = bookName.split("/")
    const pdfFilename = arr[arr.length - 1]
    const thumbnailFilename = pdfFilename.replace('.pdf', '.jpg').replace(".epub", ".jpg")
    return `${this.configService.getBaseStoreUrl().replaceAll("\\", "/")}/data/thumbnails/${thumbnailFilename}`
  }

  public generateBookStoreUrl(bookName: string) {
    return this.configService.getBaseStoreUrl() + '/' + bookName;
  }

  public async generateThumbnail(file: string) {
    file = PathUtils.normalize(file)

    const thumbnailPath = this.generateBookThumbnailUrl(file)
    PathUtils.ensureDirectoryExistence(thumbnailPath)

    if (fs.existsSync(thumbnailPath)) {
      console.log(thumbnailPath + "已存在 不重新生成")
      return;
    }

    if (file.toUpperCase().endsWith("PDF")) {
      return await this.generatePDFThumbnail(file, thumbnailPath)
    }

    if (file.toUpperCase().endsWith("EPUB")) {
      return await this.generateEPUBThumbnail(file, thumbnailPath)
    }

    console.error("未知的书籍类型", file)
  }

  /**
   *
   * 获取PDF缩略图
   * @param {string} file
   * @return {*}
   * @memberof BookService
   */
  private async generatePDFThumbnail(file: string, thumbnailPath: string) {

    let appPath = PathUtils.normalize(process.cwd())

    if (process.env.NODE_ENV === 'production') {
      // package env
      appPath += '/resources'
    }
    let cmd = `java  -classpath "${appPath}/native/aspose-words-15.8.0-jdk16.jar;${appPath}/native/aspose-pdf-22.6.0.jar" "${appPath}/native/PDFUtils.java" "${file}" "${thumbnailPath}"`
    console.log(cmd)
    const {stdout, sterr} = await exec(cmd)
    console.log(stdout)
    console.log(sterr)
  }



  /**
   *
   * 获取EPUB缩略图
   * @param {string} file
   * @memberof BookService
   */
  private async generateEPUBThumbnail(file: string, thumbnailPath: string) {
    const zip = new StreamZip.async({ file });

    const container = await zip.entryData("META-INF/container.xml")
    const containerDoc = (new DOMParser).parseFromString(container.toString(), 'application/xml');
    const fullPath = containerDoc.querySelector("rootfile")?.getAttribute("full-path")
    if (!fullPath) {
      throw new Error(`无法获取到fullPath ${containerDoc}`)
    }

    const data = await zip.entryData(fullPath)
    const doc = (new DOMParser).parseFromString(data.toString(), 'application/xml');
    console.log(doc)
    // 缩略图名称
    const coverContent = doc.querySelector('metadata [name=cover]')?.getAttribute("content")
    const coverHref = doc.querySelector(`manifest [id='${coverContent}']`)?.getAttribute("href")

    let prefix = ""
    if (fullPath.indexOf("OEBPS") != -1) {
      prefix = "OEBPS/"
    }
    const coverData = await zip.entryData(prefix + coverHref)
    fs.promises.writeFile(thumbnailPath, coverData)
  }
}
