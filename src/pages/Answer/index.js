import React, { PureComponent } from 'react'
import './style.css'
// import Gap from 'Component/gap/index'
import Progress from 'Component/progress/index'
import Subject from 'Component/subject/index'
import Gap from 'Component/gap/index'
import MyHead from 'Component/header/index'
import cloneDeep from 'lodash/cloneDeep'
import request from 'Service/index'
import { setTimeout } from 'timers'
import cs from 'classnames'
import queryParams from 'Asset/utils/queryParams'
import { sendTeaEnterEvent, sendTeaCommEvent } from 'Asset/utils/tea_utils'

class Answer extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      subject: {},
      error_shade: false,
      reset_progress: false,
      reset_progress_count: 10
    }
    this.action_reset_progress = this.action_reset_progress.bind(this)
    this.action_select = this.action_select.bind(this)
    this.action_error_shade = this.action_error_shade.bind(this)
    this.freeze = false
    this.timeoutCount = 0
  }

  gameoverCallback = (status) => {
    if (status === 1003) {
      location.href = '/motor/sf/limit.html'
    } else if (status === 3) {
      this.setState({
        subject: {
          text: '已完成答题，请明天继续'
        }
      })
    }
  }

  init () {
    return request.get('/motor/sf/game/init').then(res => {
      let status = res.status || {}
      if (status.code === 0 || status.code === 1) {
        return true
      } else {
        this.gameoverCallback(status.code)
      }
    })
  }

  next () {
    return request.get('/motor/sf/game/next').then(res => {
      let status = res.status || {}
      if (status.code === 0) {
        this.setState({
          subject: res.data.question
        })
      } else {
        this.gameoverCallback(status.code)
      }

      return status.code === 0
    })
  }

  answer (option_id) {
    return request.post('/motor/sf/game/answer', {
      option_id,
      referrer_code: queryParams('referrer_code')
    }).then(res => {
      if (res.status.code === 0) {
        return res.data
      }
      return null
    })
  }

  action_award = () => {
    setTimeout(() => {
      location.href = '/motor/sf/car_hero/success.html?referrer_code=' + queryParams('referrer_code') + '&channel=' + queryParams('channel')
    }, 1000)
    // 手动置状态
    this.setState({
      subject: {
        ...this.state.subject,
        continual_right_num: 3
      }
    })
  }

  action_judge = (data, option_list, option_id) => {
    // 选项状态更改
    option_list.forEach(el => {
      if (data.is_pass) {
        el.option_id === option_id && (el.type = 'correct')
      } else {
        el.option_id === option_id && (el.type = 'error')
        el.option_id === data.correct_answer_id && (el.type = 'correct')
      }
    })
    // 错误提示
    !data.is_pass && this.action_error_shade()
    return option_list
  }

  componentDidMount () {
    sendTeaEnterEvent({
      page_id: 'page_honor_battle_answer'
    })

    this.init().then((status) => {
      status && this.next()
    })
  }

  action_reset_progress (count) {
    this.setState({
      reset_progress: true,
      reset_progress_count: count
    })
  }

  action_error_shade () {
    this.setState({
      error_shade: true
    }, () => {
      setTimeout(() => {
        this.setState({
          error_shade: false
        })
      }, 500)
    })
  }

  action_select = async (option_id = -1, number = -1) => {
    if (this.freeze) return
    this.freeze = true
    // 超时
    if (option_id === -1) {
      this.timeoutCount++
    } else {
      this.timeoutCount = 0
    }

    this.action_reset_progress(0)

    try {
      let data = await this.answer(option_id)
      if (data) {
        let option_list = cloneDeep(this.state.subject.option_list)
        // 中奖了
        data.is_awarded && this.action_award()
        // 判题
        option_list = this.action_judge(data, option_list, option_id)

        // 埋点
        sendTeaCommEvent('web_clk_event', {
          page_id: 'page_honor_battle_answer',
          obj_id: 'honor_battle_answer',
          extra_params: JSON.stringify({
            result: data.is_pass ? 'correct' : option_id === -1 ? 'timeout' : 'error',
            number: number
          })
        })

        // 重绘页面
        this.setState({
          subject: {
            ...this.state.subject,
            option_list: option_list
          }
        })

        // 没中奖,且超时不大于3次继续下一题
        !data.is_awarded && (this.timeoutCount < 3) && setTimeout(async () => {
          try {
            let status = await this.next()
            if (!status) return
            this.freeze = false
            this.action_reset_progress(10)
          } catch (e) {
            console.error(e)
          }
        }, 1000)
      }
    } catch (e) {

    }
  }

  render () {
    let { option_list = [], text = '', continual_right_num = 0 } = this.state.subject
    let className = {
      'page-answer': true,
      'error-shader': this.state.error_shade
    }
    return (
      <div className={cs(className)} >
        <MyHead first_text="懂车英雄" second_text={`问题 ${continual_right_num}/3`} />
        <Gap height="35px" />
        <div className="body">
          <div className="content-text">{text}</div>
          <Gap height="76px" />
          {option_list.length && <Progress action_timeout={this.action_select} reset={this.state.reset_progress} count={this.state.reset_progress_count} />}
          <Gap height="31px" />
          <Subject items={option_list} action_select={this.action_select} />
        </div>
      </div>
    )
  }
}

export default Answer
