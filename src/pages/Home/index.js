import React, { PureComponent } from 'react'
import './style.css'
import {ContextConsumer} from '$src/context/index'

class Home extends PureComponent {
  changeState = () => {
    this.props.commit('color', 'abso')
  }

  render () {
    return (
      <div>{this.props.color}<button onClick={this.changeState}>修改state</button></div>
    )
  }
}
export default ContextConsumer((state) => {
  return {
    position: state.pos.position,
    color: state.color
  }
})(Home)