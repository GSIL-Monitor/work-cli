import React, { PureComponent } from 'react'
import './index.css'

export default class RankAtom extends PureComponent {
  render () {
    let { model } = this.props
    return <div className='rankList-atom'>
      <div className="no fl">{model.rank}</div>
      <div className="avatar fl">
        <img src={model.avatar_url} alt=""/>
      </div>
      <div className="user_name fl">{model.user_name}</div>
      <div className="money fr">{model.score}元</div>
    </div>
  }
}
