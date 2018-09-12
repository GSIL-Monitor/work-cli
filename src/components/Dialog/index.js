import React, {PureComponent} from 'react'
import {createPortal} from 'react-dom'

export default class Dialog extends PureComponent {
  constructor (props) {
    super(props)

    const doc = window.document
    this.node = doc.createElement('div')
    doc.body.appendChild(this.node)
  }

  render () {
    return createPortal(
      <div className="dialog">
        {this.props.children}
      </div>, // 塞进传送门的JSX
      this.node // 传送门的另一端DOM node
    )
  }

  componentWillUnmount () {
    window.document.body.removeChild(this.node)
  }
}
