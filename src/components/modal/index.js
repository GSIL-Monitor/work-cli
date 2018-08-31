import React, { PureComponent } from 'react'
import Gap from '../gap'
import Clipboard from 'clipboard'
import './index.css'
import {openApp} from 'Asset/utils/openapp'
import ua from 'Asset/utils/ua'

export default class Modal extends PureComponent {
  componentDidMount () {
    var clip = new Clipboard('.btn')
    clip.on('success', function (e) {
      console.log(e)
    })
    clip.on('error', function (e) {
      console.log(e)
    })
  }

  openApp = () => {
    let link = ua.os.toutiao ? 'https://d.toutiao.com/J9F4/' : 'https://d.toutiao.com/dfdx/'
    if (this.props.channel === 'dnqc') {
      link = 'https://d.toutiao.com/LQp9/'
    }
    openApp('snssdk36://', link, link)
  }

  render () {
    let {cdkey} = this.props
    return <div className="car-modal">
      <div className="car-modal-content">
        <Gap height="29px" />
        <div className="car-modal--img"></div>
        <Gap height="17px" />
        <div className="car-modal--text-main">换取红包奖励</div>
        <Gap height="10px" />
        <div className="car-modal--text-assitant">下载懂车帝App进入直播输入兑换码</div>
        <Gap height="50px" />
        <div className="car-modal--click">
          <div className="car-modal--click-area">
            <span>我的兑换码：<span id="dhm">{cdkey}</span></span>
          </div>
          <div className="car-modal--click-tip" >点击复制兑换码</div>
        </div>
      </div>
      <div className="car-modal-footer btn" data-clipboard-action="copy" data-clipboard-target="#dhm" onClick={this.openApp} >立即前往</div>
    </div>
  }
}
