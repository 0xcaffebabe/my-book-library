import React from 'react';
import { Col, Row, Button, Layout, message, Input, Dropdown   } from 'antd';
import type { MenuProps } from 'antd';
const { Header, Content } = Layout;
import styles from './HomePage.module.css'
import BookDTO from '@/dto/BookDTO';
import IndexService from 'services/IndexService';
import StoreService from 'services/StoreService';
import BaseUrlSetting from './BaseUrlSetting';
import Book from './components/Book'
import IndexGenerator from './components/IndexGenerator';

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
  private indexService = IndexService.newInstance()

  private storeService = StoreService.newInstance();

  private originBookList: BookDTO[] = []

  private indexGenerator: React.RefObject<IndexGenerator>;

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
      this.originBookList = await this.indexService.getBookIndex()
      this.setState({
        bookList: this.originBookList
      })
  }

  async handleReindex() {
    this.indexGenerator.current?.display()
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
        <Row>
          {this.state.bookList.map(v =>
          <Col xs={12} sm={12} md={8} lg={6} xl={6} key={v.name}>
            <Book book={v}/>
          </Col>)}
        </Row>
      </Content>
      <IndexGenerator ref={this.indexGenerator}/>
    </Layout>;
  }
}
