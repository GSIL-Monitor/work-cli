import React, { PureComponent } from 'react'
import './style.less'
import Button from 'Component/button'
import request from 'Service/index'
import queryParams from 'Asset/utils/queryParams'
import { sendTeaEnterEvent, sendTeaCommEvent } from 'Asset/utils/tea_utils'
import ua from 'Asset/utils/ua'
import {openApp} from 'Asset/utils/openapp'
import QRCode from 'qrcode'
import { square } from 'Asset/utils/test'
import img from 'Asset/images/backflow-bg.png'

square()

function loadConfScript (confKey, callback) {
  const s = document.createElement('script')
  s.setAttribute('src', `https://s2.pstatp.com/growth/confucius/confs/${confKey.replace(/\//g, '-')}.js?t=${Date.now()}`)
  s.onload = callback
  document.body.appendChild(s)
}

window.weixinShare({
  shareTitle: '懂车就来答，把车开回家，你敢来吗？',
  shareDesc: '每晚9点准时开始，现金大奖等你来拿！',
  shareImg: 'https://s3.pstatp.com/growth/mobile_detail_auto/image/dongchedi_logo_242f4cd45d18aea82f6f31fae26fb5bf.png'
})

// const URL = {
//   wannianli: 'https://d.toutiao.com/63Dx/', // 万年历
//   kugou: 'https://d.toutiao.com/kebR/', // 酷狗
//   migu: 'https://d.toutiao.com/Aj1Q/', // 万年历
//   xunfei: 'https://d.toutiao.com/LQp9/', // 讯飞
//   wifi: 'https://d.toutiao.com/Ysdd/', // wifi万能钥匙
//   youku: 'https://d.toutiao.com/dPfe/', // 优酷
//   zssh: 'https://d.toutiao.com/kebR/', // 掌上生活
//   douyin: 'https://d.toutiao.com/8sKP/', // 抖音
//   dnqc: 'https://d.toutiao.com/LQp9/' // 东南汽车
// }

class Backflow extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      model: null,
      img_qr_url: '',
      img_share_url_type: 1, // 1是离线游戏，2是下载
      hasLoad: false,
      channels: {}, // 渠道号
      modal: false // 是否弹框，在掌上生活app里，点击下载需要弹窗
    }
    this.channel = queryParams('channel')
    this.aid = queryParams('aid')
    this.device_id = queryParams('did') || queryParams('device_id')
    this.uid = queryParams('uid') || queryParams('user_id')
    this.qrcode = +queryParams('qrcode') || 0
    this.noanswer = +queryParams('noanswer') || 0
  }

  action_set_load_state = () => {
    this.setState({
      hasLoad: true
    })
  }

  getShareMotor = () => {
    request.get('//api-mo.snssdk.com/h/1/cli/share/motor/?', {
      device_id: this.device_id,
      uid: this.uid,
      aid: this.aid
    }).then((res) => {
      this.setState({
        model: res
      })
    }).catch(e => {
      console.log(e)
    })
  }

  getShareMetaInfo = () => {
    let url = __DEV__ ? '/h/1/cli/share/meta_info/?' : '//api-mo.snssdk.com/h/1/cli/share/meta_info/?'
    request.get(url, {
      device_id: this.device_id,
      user_id: this.uid
    }).then((res) => {
      this.setState({
        model: {
          Code: res.img_share_code
        },
        img_share_url_type: res.img_share_url_type
      })
      this.buildQrCode(res.img_qr_url)
    }).catch(e => {
      console.error(e)
      this.buildQrCode()
    })
  }

  buildQrCode = (img_qr_url = 'https://d.toutiao.com/rFfq/') => {
    QRCode.toDataURL(img_qr_url, {
      margin: 1
    })
      .then(url => {
        console.log(url)
        this.setState({
          img_qr_url: url
        }, () => {
          setTimeout(() => {
            if (ua.os.ios && this.state.hasLoad) {
              // 通知ios截屏
              location.href = 'ttfshareimage://go_to_page'
            }
          }, 100)
        })
      })
      .catch(err => {
        console.error(err)
      })
  }

  componentDidMount () {
    sendTeaEnterEvent({
      page_id: 'page_honor_reflux_invitation'
    })

    if (this.qrcode) {
      this.getShareMetaInfo()
    } else {
      this.getShareMotor()
    }

    loadConfScript('motor.sf.car_hero/car_hero/backflow', () => {
      const channels = window['motor.sf.car_hero/car_hero/backflow']
      this.setState({
        channels
      })
    })
  }

  toggleModal = () => {
    this.setState({ modal: !this.state.modal })
  }

  openApp = (inModal = false) => {
    sendTeaCommEvent('web_clk_event', {
      page_id: 'page_honor_reflux_invitation',
      obj_id: 'honor_download'
    })
    let link = ''
    if (ua.os.toutiao) {
      link = 'https://d.toutiao.com/J9F4/'
    } else {
      link = this.state.channels[this.channel] || 'https://d.toutiao.com/AYVL/'
    }
    console.log(link)
    // 是否弹框，在掌上生活app里，且不是在弹窗中，打开弹窗
    if (this.channel === 'zssh' && !inModal) {
      this.toggleModal()
    } else {
      openApp('snssdk36://', link, link)
    }
  }

  goHero = () => {
    sendTeaCommEvent('web_clk_event', {
      page_id: 'page_honor_reflux_invitation',
      obj_id: 'honor_outside_answer'
    })

    window.localStorage && window.localStorage.setItem('D_HEAR_UID', this.uid)
    window.localStorage && window.localStorage.setItem('D_HEAR_DID', this.device_id)
    window.localStorage && window.localStorage.setItem('D_HEAR_AID', this.aid)
    location.href = '/motor/sf/car_hero/index.html?referrer_code=' + this.uid
  }

  render () {
    let styles = {
      color: '#ffffff',
      width: '45%',
      border: '1px solid #984CFF',
      borderRadius: '25px'
    }
    let {model} = this.state

    return (
      <div className="page-backflow">
        <img src={img} style={{display: 'none'}} onLoad={this.action_set_load_state} />
        <div className="content">
          <div className="content-image">
            <img src={this.noanswer ? '//p.pstatp.com/origin/888300006ab008a1c3fc' : '//p.pstatp.com/origin/65de0000eb3b82f88ed8'} />
          </div>
          <div className="card-bg">
            <p className="card-p">使用我的邀请码可获得1次复活机会</p>
            <p className="card-code">{model && model.Code.toUpperCase()}</p>
          </div>
          {
            this.qrcode && <div className="qrcode-container">
              <div className="qrcode"><img src={this.state.img_qr_url} /></div>
              {
                this.state.img_share_url_type === 1 ? <div className="tc">
                  <p className="qrcode-tip-img" >
                    <img src="//p.pstatp.com/origin/8e1c00a71bafda1c8fbd" alt=""/>
                  </p>
                  <div className="qrcode-tip-second" >{'连续答对3题，就有现金'}</div>
                </div> : <div className="tc">
                  <p className="qrcode-tip" >长按识别二维码</p>
                  <div className="qrcode-tip-second" >{'长按二维码, 或在应用商店下载"懂车帝"'}</div>
                </div>
              }
            </div>
          }
        </div>
        {
          !this.qrcode && <div className="flex mt48">
            <Button text="下载懂车帝" height="50px" fill="rgba(64,21,120,0.50)" styles={styles} onClick={this.openApp} />
            {!this.noanswer && <Button text="答3题 赢现金" height="50px" fill="rgba(64,21,120,0.50)" styles={styles} onClick={this.goHero} />}
          </div>
        }
        {
          this.channel && this.state.modal && (
            <div className="modal-wrapper">
              <div className="mask" onClick={this.toggleModal} />
              <div className="modal">
                <div className="modal-content">
                  <div className="img" />
                  <div className="text-main">换取红包奖励</div>
                  <div className="text-assitant">下载懂车帝App进入直播输入兑换码</div>
                </div>
                <div className="modal-footer" onClick={() => { this.openApp(true) }}>立即前往</div>
              </div>
            </div>
          )
        }
      </div>
    )
  }
}

export default Backflow
