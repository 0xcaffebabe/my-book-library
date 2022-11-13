
import Epub from 'epubjs'

import React from "react";
import fs from 'fs'
import {Blob} from 'buffer'

export default class EPUBReader extends React.Component<{file: string},{}> {

  async componentDidMount(): Promise<void> {
    const book = Epub(this.props.file)
    book.renderTo('epubBook').display()
    console.log(book)
  }

  render() {
    return <div id="epubBook" style={{height: '100%', width: '100%'}}></div>
  }
}
