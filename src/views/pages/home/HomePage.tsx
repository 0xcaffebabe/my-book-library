import React from 'react';
import { Col, Row, Button, Layout, message, Input   } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import styles from './HomePage.module.css'
import BookService from '../../../services/BookService'
import Book from '../../../dto/Book';
import IndexService from 'services/IndexService';
import { Link } from 'react-router-dom';
import ConfigService from 'services/ConfigService';
import StoreService from 'services/StoreService';

export default class HomePage extends React.Component<{}, {bookList: Book[], kw: string}> {
  private bookService = new BookService()
  private indexService = IndexService.newInstance()
  private configService = ConfigService.newInstance()

  private storeUrl = this.configService.getBaseStoreUrl()
  private originBookList: Book[] = []

  constructor(props: {}) {
    super(props)
    this.state = {
      bookList: [],
      kw: ''
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
          <Row>
            <Col span={4}>
              <Button type="primary" style={{float: 'right', marginTop: '16px'}} onClick={() => this.handleReindex()}>重建书籍索引</Button>
            </Col>
            <Col span={8}>
              <Input placeholder='搜索' value={this.state.kw} onChange={(e) => this.handleKwChange(e)}></Input>
            </Col>
            <Col span={4} offset={8}>
              <Button type="primary" onClick={() => this.restore()}>还原pdf历史记录</Button>
            </Col>
          </Row>
      </Header>
      <Content className={styles.bookList}>
        <Row>
          {this.state.bookList.map(v =>
          <Col span={6} key={v.name}>
            <div className={styles.bookItem} style={{color: '#000'}}>
              <Link to={"/reader?file=" + this.storeUrl + '/' + v.phyLoc}>{v.name}</Link>
            </div>
          </Col>)}
        </Row>
      </Content>
    </Layout>;
  }
}
