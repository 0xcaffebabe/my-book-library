import CategoryDTO from "dto/Category";
import React from "react";

export default class EPUBReaderCategoryItem extends React.Component<{category: CategoryDTO, onNav: (a: string) => void}, {}> {

  render(){
    return <li>
      <a href="#" onClick={(e) => this.props.onNav(this.props.category.href)}>{this.props.category.label}</a>
      <ul>
        {this.props.category.children.map(v => <EPUBReaderCategoryItem category={v} onNav={this.props.onNav}></EPUBReaderCategoryItem>)}
      </ul>
    </li>
  }
}
