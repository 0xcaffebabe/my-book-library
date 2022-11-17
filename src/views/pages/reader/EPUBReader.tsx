
import Epub, { NavItem } from 'epubjs'

import React from "react";
import { Layout, Drawer} from 'antd'
import CategoryDTO from 'dto/Category';
import EPUBReaderCategoryList from './EPUBReaderCategoryList';
import Reader from './Reader';
const { Content } = Layout;

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

export default class EPUBReader extends React.Component<{file: string},{cateList: CategoryDTO[], showCategory: boolean}>  implements Reader{
  private book: ePub.Book | null = null

  constructor(props: any) {
    super(props)
    this.state = {cateList: [], showCategory: false}
  }
  public eyesMode() {
    this.setTheme('eye')
  }
  public zenMode() {
    // TODO
  }
  public openCategory () {
    this.setState({
      showCategory: true
    })
  }

  private onKeydown = (e: KeyboardEvent) => {
    if (e.key == 'ArrowRight' || e.code == 'PageDown') {
      this.next()
    }
    if (e.key == 'ArrowLeft' || e.code == 'PageUp') {
      this.prev()
    }
    console.log(this, e)
  }

  private onWheel = (e: WheelEvent) => {
    console.log(e)
    if (e.deltaY > 0) {
      this.next()
    }
    if (e.deltaY < 0) {
      this.prev()
    }
  }

  async componentDidMount(): Promise<void> {
    this.book = Epub(this.props.file)
    const point = this.getPoint()
    if (point) {
      await this.book.renderTo('epubBook', {
        width: window.innerWidth,
				height: window.innerHeight- 100,
      }).display(point)
    }else {
      await this.book.renderTo('epubBook').display()
    }
    this.setState({cateList: nav2Cate(this.book.navigation.toc)})
    this.registerTheme()
    document.addEventListener('keydown', this.onKeydown)
    document.addEventListener('wheel', this.onWheel)
    this.book.rendition.on('keydown', this.onKeydown)
  }

  componentWillUnmount(): void {
    document.removeEventListener('keydown', this.onKeydown)
    document.removeEventListener('wheel', this.onWheel)
  }

  async next() {
    await this.book?.rendition.next()
    this.savePoint()
  }

  async prev() {
    await this.book?.rendition.prev()
    this.savePoint()
  }

  savePoint() {
    const data = localStorage.getItem('epub.history') || '{}'
    let map = JSON.parse(data)
    const arr = this.props.file.split("/")
    const filename = arr[arr.length - 1]
    map[filename] = (this.book?.rendition.currentLocation() as any).end.cfi
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

  async onNav(href: string) {
    console.log(await this.book?.rendition.display(href))
    console.log(href)
  }

  render() {
    return <Layout style={{height: '100%'}} id="epubMain">
            <Layout>
              <div>
              <Drawer  title="Basic Drawer" placement="left" onClose={() => this.setState({showCategory: false})} open={this.state.showCategory}>
                <EPUBReaderCategoryList categoryList={this.state.cateList} onNav={this.onNav.bind(this)}></EPUBReaderCategoryList>
              </Drawer>
              </div>
              <Content><div id="epubBook"></div></Content>
            </Layout>
          </Layout>
  }
}
