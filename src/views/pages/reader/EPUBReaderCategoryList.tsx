import CategoryDTO from "../../../dto/Category";
import React from "react";
import EPUBReaderCategoryItem from "./EPUBReaderCategoryItem";

export default class EPUBReaderCategoryList extends React.Component<{categoryList: CategoryDTO[], onNav: (a: string) => void}, {}> {

  render() {
    return <ul>
      {this.props.categoryList.map(v => <EPUBReaderCategoryItem category={v} onNav={this.props.onNav}></EPUBReaderCategoryItem>)}
    </ul>
  }
}
