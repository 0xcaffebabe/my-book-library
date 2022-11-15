
export default interface BookDTO {


  /**
   *
   * 书籍ID 一般给名称一样
   * @type {string}
   * @memberof Book
   */
  id: string

  /**
   *
   * 书籍名称
   * @type {string}
   * @memberof Book
   */
  name: string


  /**
   *
   * 书籍物理位置
   * @type {string}
   * @memberof Book
   */
  phyLoc: string


  /**
   *
   * 书籍缩略图
   * @type {string}
   * @memberof Book
   */
  thumbnail: string

}
