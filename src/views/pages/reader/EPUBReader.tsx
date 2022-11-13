
import Epub from 'epubjs'

import React from "react";
import fs from 'fs'
import {Blob} from 'buffer'
import {Button} from 'antd'

const themeList = [
  {
    name: 'default',
    style: {
      body: {
        color: '#000', background: '#fff'
      }
    }
  },
  {
    name: 'eye',
    style: {
      body: {
        color: '#000', background: '#ceeaba'
      }
    }
  },
  {
    name: 'night',
    style: {
      body: {
        color: '#fff', background: '#000'
      }
    }
  },
  {
    name: 'gold',
    style: {
      body: {
        color: '#000', background: 'rgb(241,236,226)'
      }
    }
  }
]

export default class EPUBReader extends React.Component<{file: string},{}> {
  private book: ePub.Book | null = null

  async componentDidMount(): Promise<void> {
    this.book = Epub(this.props.file)
    const point = this.getPoint()
    if (point) {
      await this.book.renderTo('epubBook').display(point)
    }else {
      await this.book.renderTo('epubBook').display()
    }
    this.registerTheme()
  }

  next() {
    this.book?.rendition.next()
    this.savePoint()
  }

  prev() {
    this.book?.rendition.prev()
    this.savePoint()
  }

  savePoint() {
    const data = localStorage.getItem('epub.history') || '{}'
    let map = JSON.parse(data)
    const arr = this.props.file.split("/")
    const filename = arr[arr.length - 1]
    map[filename] = this.book?.rendition.currentLocation().start.cfi
    localStorage.setItem('epub.history', JSON.stringify(map))
  }

  getPoint() {
    const data = localStorage.getItem('epub.history') || '{}'
    let map = JSON.parse(data)
    const arr = this.props.file.split("/")
    const filename = arr[arr.length - 1]
    return map[filename] || ''
  }

  registerTheme(){
    themeList.forEach(v => {
      this.book?.rendition.themes.register(v.name, v.style)
    })
  }

  setTheme(name: string) {
    console.log(this.book?.rendition.themes)
    this.book?.rendition.themes.select(name)
  }

  render() {
    return <div>
        <Button type="primary" onClick={() => this.prev()}>prev</Button>
        <Button type="primary" onClick={() => this.next()}>next</Button>
        <Button type="primary" onClick={() => this.setTheme('eye')}>护眼</Button>
        <div id="epubBook" style={{height: '100%', width: '100%'}}></div>
      </div>
  }
}
