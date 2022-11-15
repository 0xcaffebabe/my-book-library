
import BookDTO from '@/dto/BookDTO'
import fs from 'fs'
import StoreService from 'services/StoreService'
import { DataType } from 'enums/DataType'
import ConfigService from './ConfigService'
import path from 'path'

import util from 'util';
import PathUtils from 'utils/PathUtils'
import StreamZip from 'node-stream-zip'


const exec = util.promisify(require('child_process').exec);

export default class BookService {

  private static instance:BookService

  private constructor() {}

  public static newInstance() {
    return this.instance || (this.instance = new BookService())
  }

  private storeService = StoreService.newInstance()

  private configService = ConfigService.newInstance()

  public async getBookList(): Promise<BookDTO[]> {
    return this.storeService.getData(DataType.BOOK_LIST, '[]')
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
    let cmd = `java  -classpath ${appPath}/native/aspose-words-15.8.0-jdk16.jar;${appPath}/native/aspose-pdf-22.6.0.jar ${appPath}/native/PDFUtils.java ${file} ${thumbnailPath}`
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
    const data = await zip.entryData('OEBPS/content.opf')
    const doc = (new DOMParser).parseFromString(data.toString(), 'application/xml');
    // 缩略图名称
    const coverContent = doc.querySelector('metadata [name=cover]')?.getAttribute("content")
    const coverHref = doc.querySelector(`manifest [id=${coverContent}]`)?.getAttribute("href")

    const coverData = await zip.entryData("OEBPS/" + coverHref)
    fs.promises.writeFile(thumbnailPath, coverData)
  }
}
