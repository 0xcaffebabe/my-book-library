
export default interface Reader {


  /**
   * 进入护眼模式
   *
   * @memberof Reader
   */
  eyesMode: () => void


  /**
   *
   * 进入专注模式
   * @memberof Reader
   */
  zenMode: () => void


  /**
   *
   * 打开目录
   * @memberof Reader
   */
  openCategory: () => void
}
