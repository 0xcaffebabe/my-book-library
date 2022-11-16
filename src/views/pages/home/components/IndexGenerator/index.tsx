import { Progress, Modal } from "antd";
import React from "react";
import IndexService from 'services/IndexService';

export default class IndexGenerator extends React.Component<{}, {show: boolean, progress: number, book: string}> {

  private indexService = IndexService.newInstance()

  constructor(props: {}) {
    super(props)
    this.state = {
      show: false,
      progress: 0,
      book: '',
    }
  }

  display() {
    this.setState({show: true})
  }

  indexing() {
    this.indexService.index((book, index, total) => {
      this.setState({
        book,
        progress: Math.floor((index / total) * 100)
      })
    })
  }

  render() {
    return (
      <Modal title="索引重建" open={this.state.show} onCancel={() => this.setState({show: false})} onOk={() => this.indexing()} okText="开始" cancelText="取消">
        <Progress percent={this.state.progress} status="active" />
        <p>{this.state.book}</p>
      </Modal>
    )
  }
}
