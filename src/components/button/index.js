import React, { PureComponent } from 'react'
import cs from 'classnames'
import './index.css'

export default class Button extends PureComponent {
  constructor (props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  onClick () {
    this.props.onClick && this.props.onClick(this.props.id, this.props.index)
  }

  render () {
    let {text, type, fill, height, pos, model, styles = {}} = this.props
    let style = {
      ...styles,
      background: fill,
      height,
      lineHeight: height,
      textAlign: pos || 'center'
    }
    let className = {
      button: true,
      relative: true,
      answer: model === 'answer',
      correct: type === 'correct',
      error: type === 'error'
    }
    return <div className={cs(className)} onClick={this.onClick} style={style}>{text}</div>
  }
}
