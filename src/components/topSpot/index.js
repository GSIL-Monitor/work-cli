import React, { PureComponent } from 'react'
import './index.css'

export default class TopSpot extends PureComponent {
  render () {
    let {model} = this.props
    let user_name = model.user_name.length > 3 ? model.user_name.slice(0, 1) + '....' + model.user_name.slice(-1) : model.user_name
    return <div className="ranklist-topSpot">
      <div className="avatar">
        <img src={model.avatar_url}/>
        <div className="top_num">{model.rank}</div>
      </div>
      <div className="user_name">{user_name}</div>
      <div className="money">{model.score}元</div>
    </div>
  }
}
