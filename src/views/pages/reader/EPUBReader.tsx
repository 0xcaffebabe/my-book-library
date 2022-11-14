
import Epub, { NavItem } from 'epubjs'

import React from "react";
import fs from 'fs'
import {Blob} from 'buffer'
import {Button, Layout} from 'antd'
import CategoryDTO from 'dto/Category';
import EPUBReaderCategoryList from './EPUBReaderCategoryList';
const { Header, Footer, Sider, Content } = Layout;

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

function nav2Cate(nav: NavItem[]): CategoryDTO[] {
  if (!nav || nav.length == 0) {
    return []
  }
  return nav.map(v => {return {
    label: v.label,
    href: v.href,
    children: nav2Cate(v.subitems || [])
  }})
}

export default class EPUBReader extends React.Component<{file: string},{cateList: CategoryDTO[]}> {
  private book: ePub.Book | null = null

  constructor(props: any) {
    super(props)
    this.state = {cateList: []}
  }

  async componentDidMount(): Promise<void> {
    this.book = Epub(this.props.file)
    const point = this.getPoint()
    if (point) {
      await this.book.renderTo('epubBook').display(point)
    }else {
      await this.book.renderTo('epubBook').display()
    }
    this.setState({cateList: nav2Cate(this.book.navigation.toc)})
    console.log(this.state)
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

  onNav(href: string) {
    console.log(this.book?.rendition.display(href))
    console.log(href)
  }

  render() {
    console.log(this.state)
    return <Layout style={{height: '100%'}}>
            <Header><Button type="primary" onClick={() => this.prev()}>prev</Button>
                <Button type="primary" onClick={() => this.next()}>next</Button>
                <Button type="primary" onClick={() => this.setTheme('eye')}>护眼</Button></Header>
            <Layout>
              <Sider>
                <div style={{height: '100%', overflow: 'scroll'}}>
                  <EPUBReaderCategoryList categoryList={this.state.cateList} onNav={this.onNav.bind(this)}></EPUBReaderCategoryList>
                </div>
              </Sider>
              <Content><div id="epubBook" style={{height: '100%', width: '100%'}}></div></Content>
            </Layout>
          </Layout>
  }
}
