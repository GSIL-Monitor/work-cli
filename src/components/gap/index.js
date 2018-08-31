import React, { PureComponent } from 'react'

export default class Gap extends PureComponent {
  render () {
    let {height} = this.props
    return <div style={{height, width: '100%'}}></div>
  }
}
