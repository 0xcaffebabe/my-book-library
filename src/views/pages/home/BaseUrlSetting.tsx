import StoreService from "services/StoreService"
import { Modal,Input, message } from "antd"
import React from "react"


export default class BaseUrlSetting extends React.Component<{open: boolean},{url: string}> {

  constructor(props: any) {
    super(props)
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({url: event.target.value})
  }

  handleOk() {
    StoreService.newInstance().saveBaseStoreUrl(this.state.url)
    message.info("成功")
  }

  render(): React.ReactNode {
    return <Modal title="Basic Modal" onOk={() => this.handleOk()} open={this.props.open}>
    <Input onChange={(e) => this.handleChange(e)}/>
  </Modal>
  }
}
