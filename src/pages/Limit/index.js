import React, { PureComponent } from 'react'
import './index.css'
import Button from 'Component/button'
import Gap from 'Component/gap/index'
import MyHead from 'Component/header/index'
import ua from 'Asset/utils/ua'
import {openApp} from 'Asset/utils/openapp'

class Limit extends PureComponent {
  linkToDownload = () => {
    let link = ua.os.toutiao ? 'https://d.toutiao.com/rFfq/' : 'https://d.toutiao.com/dfdx/'

    openApp('snssdk36://', link, link)
  }

  render () {
    let style = {
      'boxShadow': '0 4px 0 0 #D70934, 0 10px 30px 0 rgba(255,54,96,0.27)',
      'color': '#ffffff'
    }
    return (
      <div className="page-limit" >
        <MyHead first_text=""/>
        <Gap height="35px" />
        <div className="content">
          <div className="content-text">今天的被你答完了<br/>明天再来吧</div>
          <div className="content-image"></div>
        </div>
        <div className="footer">
          <Button text="下载懂车帝，赢购车补贴" fill="#FF3660" styles={style} onClick={this.linkToDownload} />
        </div>
      </div>
    )
  }
}

export default Limit
