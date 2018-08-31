import React, { PureComponent } from 'react'
import './index.css'

export default class MyHead extends PureComponent {
  goBack () {
    history.go(-1)
  }

  render () {
    let { text, first_text, second_text, explain } = this.props
    return <div className='common-head'>
      <div className="common-head--back" onClick={this.goBack}>
        <div className="back"></div>
      </div>
      {
        text ? <div className="common-head--content">{text}</div>
          : <div className="common-head--content">
            <span className='first_text'>{first_text}</span>
            <span className='second_text'>{second_text}</span>
          </div>
      }

      <div className="common-head--share">
        {explain && <a className='explain' href="https://m.dcdapp.com/magic/runtime/?id=1273"></a>}
      </div>
    </div>
  }
}
