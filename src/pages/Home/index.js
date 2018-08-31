import React, { PureComponent } from 'react'
import './style.css'
import ua from 'Asset/utils/ua'
import Gap from 'Component/gap'
import MyHead from 'Component/header'
import Button from 'Component/button'
import queryParams from 'Asset/utils/queryParams'
import { sendTeaEnterEvent, sendTeaCommEvent } from 'Asset/utils/tea_utils'
// import jsonp from 'lc-jsonp'
function loadConfScript (confKey, callback) {
  const s = document.createElement('script')
  s.setAttribute('src', `https://s2.pstatp.com/growth/confucius/confs/${confKey.replace(/\//g, '-')}.js?t=${Date.now()}`)
  s.onload = callback
  document.body.appendChild(s)
}

class Home extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      userInfo: null,
      adConfig: null
    }
  }

  componentDidMount () {
    sendTeaEnterEvent({
      page_id: 'page_honor_battle_index'
    })
    loadConfScript('motor.sf.car_hero/car_hero/index', () => {
      const adConfig = window['motor.sf.car_hero/car_hero/index']
      this.setState({
        adConfig: adConfig.name ? adConfig : null
      })
    })
  }
  redirectLink = () => {
    let { url, name } = this.state.adConfig
    if (ua.os.toutiao) {
      url = `sslocal://webview?url=${encodeURIComponent(url)}&title=${encodeURIComponent(name)}`
    }
    window.location.href = url
  }

  linkToChallenge () {
    sendTeaCommEvent('web_clk_event', {
      page_id: 'page_honor_battle_index',
      obj_id: 'honor_battle_start'
    })

    location.href = '/motor/sf/car_hero/answer.html?referrer_code=' + queryParams('referrer_code') + '&channel=' + queryParams('channel')
  }

  linkToRankList () {
    sendTeaCommEvent('web_clk_event', {
      page_id: 'page_honor_battle_index',
      obj_id: 'honor_battle_leader_board'
    })

    location.href = 'https://d.toutiao.com/LQp9/'
    // location.href = '/motor/sf/car_hero/ranklist.html'
  }

  render () {
    let style = {
      'boxShadow': '0 4px 0 0 #D70934, 0 10px 30px 0 rgba(255,54,96,0.27)',
      'color': '#ffffff'
    }
    const { adConfig } = this.state
    const d = new Date()
    return (
      <div className={'page-home' + (adConfig ? ' has-ad' : '')}>
        <MyHead text="" explain={true} />
        <div className="content">
          <div className="content-image"></div>
        </div>
        {adConfig ? <Gap height="12px" /> : <Gap height="42px" />}
        {adConfig &&
          <div className="forecast">
            <div className="title">开场预告</div>
            <div className="games">
              <div className="game curr">
                <div className="date">7月{d.getDate()}日</div>
                <div className="time">21:00</div>
              </div>
              <div className="game next">
                <div className="date">7月{d.getDate() + 1}日</div>
                <div className="time">21:00</div>
              </div>
            </div>
            <div className="ad" onClick={this.redirectLink}><a><img width={adConfig.imgWidth} src={adConfig.imgsrc} /></a></div>
          </div>
        }
        <div className="footer">
          <Button text="立即挑战" styles={style} fill="#FF3660" onClick={this.linkToChallenge} />
          <Button text={adConfig ? adConfig.downloadText : '下载懂车帝，答题赢补贴'} styles={{color: '#ffffff'}} onClick={this.linkToRankList}/>
        </div>
      </div>
    )
  }
}

export default Home
