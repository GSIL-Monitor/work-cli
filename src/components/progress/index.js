import React, { PureComponent } from 'react'
import { Circle } from 'rc-progress'
import './index.css'

export default class Progress extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      second: 10
    }
  }

  static timer = null

  componentDidMount () {
    this.countDown(this.state.second)
  }

  UNSAFE_componentWillReceiveProps (newProps) {
    if (newProps.reset === true && typeof newProps.count !== 'undefined') {
      this.setState({
        second: newProps.count
      }, () => {
        clearInterval(this.timer)
        this.countDown(this.state.second)
      })
    }
  }

  countDown (second) {
    this.timer = setInterval(() => {
      if (second === 0) {
        // this.setState({
        //   second: '时间耗尽'
        // })
        this.props.action_timeout && this.props.action_timeout()
        return clearInterval(this.timer)
      }
      second--
      this.setState({
        second: second
      })
    }, 1000)
  }

  render () {
    let { second } = this.state
    if (second < 10) {
      second = '0' + second
    }

    return <div className="relative progress">
      <Circle percent={second * 10} strokeWidth="8" strokeColor="#16FFFD" />
      <div className="center count-down">{second}</div>
    </div>
  }
}
