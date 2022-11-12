import React from 'react';
import { Col, Row, Button, Layout, message   } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import styles from './HomePage.module.css'
import BookService from '../../../services/BookService'
import Book from '../../../dto/Book';
import IndexService from 'services/IndexService';
import { Link } from 'react-router-dom';

export default class HomePage extends React.Component<{}, {bookList: Book[]}> {
  private bookService = new BookService()
  private indexService = IndexService.newInstance()

  constructor(props: {}) {
    super(props)
    this.state = {
      bookList: [] as Book[]
    }
  }

  async componentDidMount(){
      this.setState({
        bookList: await this.indexService.getBookIndex()
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

  render() {
    return <Layout className={styles.layout}>
      <Header className={styles.header}>
          <Button type="primary" style={{float: 'right', marginTop: '16px'}} onClick={() => this.handleReindex()}>重建书籍索引</Button>
      </Header>
      <Content className={styles.bookList}>
        <Row>
          {this.state.bookList.map(v =>
          <Col span={6} key={v.name}>
            <div className={styles.bookItem} style={{color: '#000'}}>
              <Link to={"/reader?file=" + v.phyLoc}>{v.name}</Link>
            </div>
          </Col>)}
        </Row>
      </Content>
    </Layout>;
  }
}
