
import Book from '@/dto/Book'
import fs from 'fs'
import StoreService from 'services/StoreService'
import { DataType } from 'enums/DataType'
import ConfigService from './ConfigService'
import path from 'path'

import util from 'util';
import PathUtils from 'utils/PathUtils'


const exec = util.promisify(require('child_process').exec);

export default class BookService {

  private static instance:BookService

  private constructor() {}

  public static newInstance() {
    return this.instance || (this.instance = new BookService())
  }

  private storeService = StoreService.newInstance()

  private configService = ConfigService.newInstance()

  public async getBookList(): Promise<Book[]> {
    return this.storeService.getData(DataType.BOOK_LIST, '[]')
  }

  public async generatePDFThumbnail(file: string) {
    file = PathUtils.normalize(file)
    const arr = file.split("/")
    const pdfFilename = arr[arr.length - 1]
    const thumbnailFilename = pdfFilename.replace('.pdf', '.jpg')
    const thumbnailPath = `${this.configService.getBaseStoreUrl().replaceAll("\\", "/")}/data/thumbnails/${thumbnailFilename}`
    PathUtils.ensureDirectoryExistence(thumbnailPath)

    if (fs.existsSync(thumbnailPath)) {
      console.log(thumbnailPath + "已存在 不重新生成")
      return;
    }

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
}
