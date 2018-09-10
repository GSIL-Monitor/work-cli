import React, { PureComponent } from 'react'
import './style.css'
import {ContextConsumer} from '$src/context/index'

class Home extends PureComponent {
  changeState = () => {
    this.props.commit('pos.position', 'absolute')
  }

  render () {
    return (
      <div>{this.props.position}<button onClick={this.changeState}>修改state</button></div>
    )
  }
}
export default ContextConsumer((state) => {
  return {
    position: state.pos.position
  }
})(Home)
