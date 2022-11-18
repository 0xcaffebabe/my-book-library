import React from 'react';
import { Col, Row, Segmented, Layout, message, Input, Dropdown   } from 'antd';
const { Header, Content } = Layout;
import styles from './HomePage.module.css'
import BookDTO from '@/dto/BookDTO';
import StoreService from 'services/StoreService';
import BaseUrlSetting from './BaseUrlSetting';
import Book from './components/Book'
import IndexGenerator from './components/IndexGenerator';
import BookService from 'services/BookService';

const items = [
  {
    key: '1',
    label: '上传数据'
  },
  {
    key: '2',
    label: '下载数据'
  },
  {
    key: '3',
    label: '重建索引'
  },
  {
    key: '4',
    label: '存储目录设置'
  }
]

export default class HomePage extends React.Component<{}, {bookList: BookDTO[], kw: string, settingVisible: boolean}> {

  private storeService = StoreService.newInstance()
  private bookService = BookService.newInstance()

  private indexGenerator: React.RefObject<IndexGenerator>;

  private allBookList: BookDTO[] = []
  private readingBookList: BookDTO[] = []

  constructor(props: {}) {
    super(props)
    this.indexGenerator = React.createRef<IndexGenerator>()
    this.state = {
      bookList: [],
      kw: '',
      settingVisible: false
    }
  }

  async componentDidMount(){
    this.allBookList = await this.bookService.getBookList()
    this.readingBookList = await this.bookService.getReadingRecord()
    this.setState({
      bookList: this.readingBookList
    })
  }

  async handleReindex() {
    this.indexGenerator.current?.display()
  }

  handleSegementChange(key: string | number) {
    if (key === '全部') {
      this.setState({
        bookList: this.allBookList
      })
    } else {
      this.setState({
        bookList: this.readingBookList
      })
    }
  }

  handleKwChange(event: React.ChangeEvent<HTMLInputElement>) {
    const kw = event.target.value
    this.setState({kw})
  }

  onMenuClick = async (key: string) => {
    if (key == '1') {
      await this.storeService.syncLocalStorage()
      message.info("上传完成")
    }
    if (key == '2') {
      this.downloadLocalStoreage()
    }
    if (key == '3') {
      this.handleReindex()
    }
    if (key == '4') {
      this.setState({settingVisible: true})
    }
  };

  async downloadLocalStoreage() {
    await this.storeService.downloadLocalStoreage()
    message.info("同步完成")
  }

  render() {
    return <Layout className={styles.layout}>
      <Header className={styles.header}>
          <Row gutter={15}>
            <Col span={8}>
              <Input placeholder='搜索' value={this.state.kw} onChange={(e) => this.handleKwChange(e)}></Input>
            </Col>
            <Col span={4} offset={12}>
              <Dropdown.Button style={{display: 'inline-block'}} type='primary' onClick={() => this.downloadLocalStoreage()} menu={{ items, onClick: (e) => this.onMenuClick(e.key) }}>同步</Dropdown.Button>
            </Col>
          </Row>
          <BaseUrlSetting open={this.state.settingVisible}/>
      </Header>
      <Content className={styles.bookList}>
        <Row style={{marginTop: '20px'}}>
          <Col span={4} offset={20}>
            <Segmented options={["最近阅读", "全部"]} onChange={(v) => this.handleSegementChange(v)}/>
          </Col>
        </Row>
        <Row>
          {this.state.bookList.filter(v => v.name.toUpperCase().indexOf(this.state.kw.toUpperCase()) != -1).map(v =>
          <Col xs={12} sm={12} md={8} lg={6} xl={6} key={v.name}>
            <Book book={v}/>
          </Col>)}
        </Row>
      </Content>
      <IndexGenerator ref={this.indexGenerator}/>
    </Layout>;
  }
}
