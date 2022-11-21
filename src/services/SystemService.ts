import PathUtils from "utils/PathUtils"
import { ipcRenderer } from "electron"
import path, { dirname } from 'path'
import os from 'os'

export default class SystemSerivce {
  private static instance: SystemSerivce

  private constructor() {}

  public static newInstance() {
    return this.instance || (this.instance = new SystemSerivce())
  }



  /**
   *
   * 统一处理开发环境、打包环境的资源目录
   * @param {string} dirName 子资源目录名
   * @return {*}
   * @memberof SystemSerivce
   */
  public getResourcePath(dirName: string = '') {
    let basePath = ''
    if (process.env.NODE_ENV === 'production') {
      const exePath = PathUtils.normalize(ipcRenderer.sendSync("app-exe-path"))
      // 获取可执行文件的父目录
      const arr = exePath.split("/")
      arr.pop()
      if (os.platform().indexOf("darwin") != -1) {
        arr.pop()
        basePath = arr.join("/")
        basePath += "/Resources"
      } else {
        basePath = arr.join("/")
        basePath += "/resources"
      }
    } else {
      basePath = PathUtils.normalize(process.cwd())
    }
    if (dirName) {
      return basePath + "/" + dirName
    }
    return basePath
  }
}
