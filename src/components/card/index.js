import React, { PureComponent } from 'react'
import Gap from 'Component/gap/index'
import Countdown from 'react-countdown-now'

import './index.css'

export default class Card extends PureComponent {
  kilo = (money) => {
    return money.toString().replace(/\B(?=(\d{3})+$)/g, ',')
  }

  render () {
    let {model, is_living, is_book} = this.props
    return <div className='m-card'>
      <div className="card-header">
        <div className="card-avator">
          <div className="avator">
            <img src={model.AvatarUrl} />
          </div>
        </div>
        <div className="card-info">
          <div className="card-info--name">{model.Name}</div>
          {
            model ? is_book ? <div className="card-info--content">
              <span>“我买了辆{model.car_name}，</span>
              <span style={{color: '#FF5F00'}}>懂车帝App</span>
              <span>补贴了</span>
              <span style={{color: '#FF5F00'}}>{this.kilo(model.Discount / 100)}</span>
              <span>元，快来看看吧”</span>
            </div>
              : <div className="card-info--content">
                <span>“我在</span>
                <span style={{color: '#FF5F00'}}>懂车帝App</span>
                <span>答题赢购车补贴，快来帮我砍价，祝我一臂之力”</span>
              </div>
              : null
          }
        </div>
      </div>
      {
        (is_book && model) ? <div className="card-info--car-image" style={{backgroundImage: model.car_image}}></div>
          : <div className="card-info--allowance">
            <Gap height="18px" />
            <div className="fz14 cFF5F00 text-center">已赢购车补贴</div>
            <div className="fz48 cFF5F00 text-center">{this.kilo(model.Discount / 100)}元</div>
            { !is_living && <div className="fz14 c333333 text-center">剩余 <Countdown date={model.NaSt * 1000} />  结束</div>}
          </div>
      }
    </div>
  }
}
