import React from 'react';
import { Col, Row, Button, Layout, message, Input   } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import styles from './HomePage.module.css'
import BookDTO from '@/dto/BookDTO';
import IndexService from 'services/IndexService';
import StoreService from 'services/StoreService';
import BaseUrlSetting from './BaseUrlSetting';
import Book from './components/Book'

export default class HomePage extends React.Component<{}, {bookList: BookDTO[], kw: string, settingVisible: boolean}> {
  private indexService = IndexService.newInstance()

  private originBookList: BookDTO[] = []

  constructor(props: {}) {
    super(props)
    this.state = {
      bookList: [],
      kw: '',
      settingVisible: false
    }
  }

  async componentDidMount(){
      this.originBookList = await this.indexService.getBookIndex()
      this.setState({
        bookList: this.originBookList
      })
  }

  async handleReindex() {
    try {
      await this.indexService.index()
      message.info("重建索引完成")
    } catch(e) {
      // message.error(e)
    }
  }

  async restore() {
    const data = (await StoreService.newInstance().getFile('pdfjs.history')) || ''
    localStorage.setItem('pdfjs.history', data)
  }

  async setBaseUrl(url: string) {
  }

  handleKwChange(event: React.ChangeEvent<HTMLInputElement>) {
    const kw = event.target.value
    this.setState({kw})
    if (!kw) {
      this.setState({bookList: this.originBookList})
    }else {
      this.setState({bookList: this.originBookList.filter(v => v.name.toUpperCase().indexOf(kw.toUpperCase()) != -1)})
    }
  }

  render() {
    return <Layout className={styles.layout}>
      <Header className={styles.header}>
          <Row gutter={15}>
            <Col span={8}>
              <Input placeholder='搜索' value={this.state.kw} onChange={(e) => this.handleKwChange(e)}></Input>
            </Col>
            <Col span={4}>
              <Button type="primary" style={{float: 'right', marginTop: '16px'}} onClick={() => this.handleReindex()}>重建书籍索引</Button>
            </Col>
            <Col span={4}>
              <Button onClick={() => this.setState({settingVisible: true})}> 存储目录设置</Button>
            </Col>
            <Col span={4} offset={4}>
              <Button type="primary" onClick={() => this.restore()}>还原pdf历史记录</Button>
            </Col>
          </Row>
          <BaseUrlSetting open={this.state.settingVisible}/>
      </Header>
      <Content className={styles.bookList}>
        <Row>
          {this.state.bookList.map(v =>
          <Col xs={12} sm={12} md={8} lg={6} xl={6} key={v.name}>
            <Book book={v}/>
          </Col>)}
        </Row>
      </Content>
    </Layout>;
  }
}
