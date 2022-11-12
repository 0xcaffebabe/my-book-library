import React from 'react';
import { Col, Row } from 'antd';
import styles from './HomePage.module.css'
import BookService from '../../services/BookService'
import Book from '../../dto/Book';

export default class HomePage extends React.Component<{}, {bookList: Book[]}> {
  private bookService = new BookService()

  constructor(props: {}) {
    super(props)
    this.state = {
      bookList: [] as Book[]
    }
  }

  async componentDidMount(){
      this.setState({
        bookList: await this.bookService.getBookList()
      })
  }

  render() {
    return <div className={styles.test}>
      <Row>
        {this.state.bookList.map(v => <Col span={6} key={v.name}>book{v.name}</Col>)}
      </Row>
    </div>;
  }
}
