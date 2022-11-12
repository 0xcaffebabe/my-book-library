import os from 'os'

export default class ConfigService {

  private static instance: ConfigService

  private constructor() {}

  public static newInstance(): ConfigService {
    return ConfigService.instance || (ConfigService.instance = new ConfigService())
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

  private getLocalStorage(): Storage | undefined {
    if (typeof localStorage !== 'undefined') {
      return localStorage
    }
  }
}
