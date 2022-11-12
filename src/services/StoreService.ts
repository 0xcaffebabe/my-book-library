import ConfigService from "./ConfigService";
import fs from 'fs'
import {DataType} from '../enums/DataType'
import PathUtils from "utils/PathUtils";

/**
 *
 * 封装过的存储服务 会在基础存储目录下的data目录进行存储
 * @export
 * @class StoreService
 */
export default class StoreService {

  private static instance: StoreService;

  private configService: ConfigService = ConfigService.newInstance()

  private constructor(){}

  public static newInstance():StoreService {
    return this.instance || (this.instance = new StoreService())
  }

  public async saveData(type: DataType, data: string) {
    const path = `${this.getDataStoreUrl()}/${type}`
    PathUtils.ensureDirectoryExistence(path)
    fs.promises.writeFile(path, data)
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

  private getDataStoreUrl() {
    return this.configService.getBaseStoreUrl() + '/data'
  }
}
