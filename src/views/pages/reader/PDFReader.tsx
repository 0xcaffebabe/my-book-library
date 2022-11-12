import React from "react";
import fs from 'fs'
import {Button, message} from 'antd'
import StoreService from "services/StoreService";

export default class PDFReader extends React.Component<{file: string},{}> {

  constructor(props: {file: string}) {
    super(props)
  }

  async componentDidMount() {
    const file = await fs.promises.readFile(this.props.file)
    window.bookFile = file
    document.getElementsByTagName('iframe')[0].contentWindow!.document.styleSheets[0].insertRule(`
    .textLayer {background-color: yellowgreen}
    `)
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
    return  <div style={{height: '100%'}}>
      <Button onClick={() => this.click()} type="primary">护眼模式</Button>
      <Button onClick={() => this.save()} type="primary">保存记录</Button>
      <iframe src="/pdf/web/viewer.html" style={{height: '100%', width: '100%'}}></iframe>
    </div>
  }
}

