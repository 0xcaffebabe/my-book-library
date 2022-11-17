import React from "react";
import fs from 'fs'
import {Button, message} from 'antd'
import StoreService from "services/StoreService";
import Reader from "./Reader";

export default class PDFReader extends React.Component<{file: string},{}>  implements Reader{

  constructor(props: {file: string}) {
    super(props)
  }
  public eyesMode () {
    document.getElementsByTagName('iframe')[0].contentWindow!.document.styleSheets[0].insertRule(`
    .textLayer {background-color: yellowgreen}
    `)
  }
  public zenMode () {
    //TODO
  }

  public openCategory () {
    //todo
  }

  async componentDidMount() {
    window.bookFile = `file:///${this.props.file}`
    // 注入css样式
    // window.cssRule = `
    //   .textLayer {background-color: yellowgreen}
    // `
  }

  click() {
    document.getElementsByTagName('iframe')[0].contentWindow!.document.styleSheets[0].insertRule(`
    .textLayer {background-color: yellowgreen}
    `)
  }

  async save() {
    await StoreService.newInstance().saveFile('pdfjs.history', localStorage.getItem('pdfjs.history') || '')
    message.info('成功')
  }

  render() {
    return  <div style={{height: 'calc(100% - 24px)', overflowY: 'hidden'}}>
      <iframe src="/pdf/web/viewer.html" style={{height: '100%', width: '100%'}}></iframe>
    </div>
  }
}

