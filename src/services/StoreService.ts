import fs from 'fs'
import {DataType} from '../enums/DataType'
import PathUtils from "utils/PathUtils";
import os from 'os'

/**
 *
 * 封装过的存储服务 会在基础存储目录下的data目录进行存储
 * @export
 * @class StoreService
 */
export default class StoreService {

  private static instance: StoreService;

  private constructor(){}

  public static newInstance():StoreService {
    return this.instance || (this.instance = new StoreService())
  }

  public async saveData(type: DataType, data: any) {
    const path = `${this.getDataStoreUrl()}/${type}`
    PathUtils.ensureDirectoryExistence(path)
    localStorage.setItem(type, JSON.stringify(data))
    fs.promises.writeFile(path, JSON.stringify(data))
  }

  public async saveFile(filename: string, data: string) {
    const path = `${this.getDataStoreUrl()}/${filename}`
    PathUtils.ensureDirectoryExistence(path)
    fs.promises.writeFile(path, data)
  }

  public async getFile(filename: string) {
    const path = `${this.getDataStoreUrl()}/${filename}`
    PathUtils.ensureDirectoryExistence(path);
    return (await fs.promises.readFile(path)).toString()
  }

  public async getData(type: DataType, defaultVal: string) :Promise<any> {
    const path = `${this.getDataStoreUrl()}/${type}`
    if (!fs.existsSync(path)) {
      return JSON.parse(defaultVal)
    }
    return JSON.parse((await fs.promises.readFile(path)).toString())
  }


  /**
   *
   * 同步本地存储到云
   * @memberof StoreService
   */
  public async syncLocalStorage() {
    const ignoreKeys: string[] = ['config::url']
    for(let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || ''
      if (ignoreKeys.some(v => v === key)) {
        continue;
      }
      await this.saveFile(key, localStorage.getItem(key) || '')
    }
  }

  public async downloadLocalStoreage() {
    const baseDir = this.getDataStoreUrl()
    const files = (await fs.promises.readdir(baseDir)).map(v => PathUtils.normalize(baseDir + "/" + v))
    for(let file of files) {
      if (fs.lstatSync(file).isDirectory()) {
        continue
      }
      const data = await fs.promises.readFile(file)
      localStorage.setItem(file.replaceAll(PathUtils.normalize(baseDir + "/"), ""), data.toString())
    }
  }

  /**
   *
   * 获取基本存储目录
   * @memberof ConfigService
   */
   public getBaseStoreUrl(): string {
    const localStorage = this.getLocalStorage()
    const url = localStorage && localStorage.getItem("config::url")
    if (url) {
      return url
    }
    const isWin = os.platform().indexOf("win32") != -1
    const isMac = os.platform().indexOf("darwin") != -1
    if (isWin) {
      return 'C:/Users/chenj/iCloudDrive/ebook'
    }
    if (isMac) {
      return '/Users/chenjiping/Library/Mobile Documents/com~apple~CloudDocs/ebook'
    }
    throw new Error("无法获取基本存储目录")
  }

  public saveBaseStoreUrl(url: string){
    localStorage.setItem("config::url", url)
  }

  private getLocalStorage(): Storage | undefined {
    if (typeof localStorage !== 'undefined') {
      return localStorage
    }
  }

  private getDataStoreUrl() {
    return this.getBaseStoreUrl() + '/data'
  }
}
