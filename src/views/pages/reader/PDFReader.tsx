import React from "react";
import fs from 'fs'

export default class PDFReader extends React.Component<{file: string},{}> {

  constructor(props: {file: string}) {
    super(props)
  }

  async componentDidMount() {
    console.log(this.props)
    const file = await fs.promises.readFile(this.props.file)
    window.bookFile = file
  }

  render() {
    return <iframe src="/pdf/web/viewer.html" style={{height: '100%', width: '100%'}}></iframe>
  }
}

