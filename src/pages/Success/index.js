import React, { PureComponent } from 'react'
import Loadable from 'react-loadable'
import './style.css'
import Gap from 'Component/gap'
import Loading from 'Component/Loading'
import MyHead from 'Component/header'
import Button from 'Component/button'
// import Modal from 'Component/modal'
import request from 'Service/index'
import queryParams from 'Asset/utils/queryParams'
import { sendTeaEnterEvent, sendTeaCommEvent } from 'Asset/utils/tea_utils'
// 实现按需加载组件
const LoadableModal = Loadable({
  loader: () => import('Component/modal'),
  loading: Loading
})
let uid = localStorage.getItem('D_HEAR_UID') || ''
let did = localStorage.getItem('D_HEAR_DID') || ''
let aid = localStorage.getItem('D_HEAR_AID') || ''

window.weixinShare({
  shareTitle: '懂车就来答，把车开回家，你敢来吗？',
  shareDesc: '每晚9点准时开始，现金大奖等你来拿！',
  shareImg: 'https://s3.pstatp.com/growth/mobile_detail_auto/image/dongchedi_logo_242f4cd45d18aea82f6f31fae26fb5bf.png',
  shareUrl: `https://m3.toutiaopage.com/motor/sf/car_hero/backflow.html?uid=${uid}&did=${did}&aid=${aid}`
})

class Success extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      modal: false,
      share: false,
      award: ''
    }
    this.action_show_modal = this.action_display_modal.bind(this, true)
    this.action_hide_modal = this.action_display_modal.bind(this, false)
    this.action_show_share = this.action_share.bind(this, true)
    this.action_hide_share = this.action_share.bind(this, false)
  }

  action_display_modal = (status) => {
    if (status) {
      sendTeaCommEvent('web_clk_event', {
        page_id: 'page_honor_battle_result',
        obj_id: 'honor_battle_exchange'
      })
    }
    this.setState({
      modal: status
    })
  }

  componentDidMount () {
    sendTeaEnterEvent({
      page_id: 'page_honor_battle_result'
    })

    let referrer_code = queryParams('referrer_code')
    request.get('/motor/sf/game/award?referrer_code=' + referrer_code).then(res => {
      if (res.status.code === 0) {
        this.setState({
          award: res.data.award
        })
      }
    })
  }

  action_share = (status) => {
    if (status) {
      sendTeaCommEvent('web_clk_event', {
        page_id: 'page_honor_battle_result',
        obj_id: 'honor_battle_share'
      })
    }
    this.setState({
      share: status
    })
  }

  render () {
    let style = {
      'boxShadow': '0 4px 0 0 #D70934, 0 10px 30px 0 rgba(255,54,96,0.27)',
      'color': '#ffffff'
    }
    return (
      <div className={'page-success answer_bg'}>
        <MyHead text="" />
        <div className="content">
          <div className="content-text">
            <div className="content-text--main">
              <p className="fz26">挑战成功</p>
              <p className="fz26">最高可得3元现金红包</p>
            </div>
            <div className="content-text--assistant fz14">打开懂车帝App领取</div>
          </div>
          <div className="content-image"></div>
        </div>

        <div className="footer">
          <Button text="兑换红包" fill="#FF3660" styles={style} onClick={this.action_show_modal} />
          <Gap height="16px" />
          <Button text="分享到微信群, 可翻倍奖励" fill="#FF3660" styles={style} onClick={this.action_show_share}/>
        </div>

        {
          this.state.share && <div>
            <div className="share-bg" onClick={this.action_hide_share}> </div>
            <div className="share-friend"></div>
          </div>
        }
        {
          this.state.modal && <div>
            <div className="mask" onClick={this.action_hide_modal}></div>
            <LoadableModal cdkey={this.state.award} channel={queryParams('channel')}/>
          </div>
        }
      </div>
    )
  }
}

export default Success
