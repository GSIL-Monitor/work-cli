import React, { PureComponent } from 'react'
import './style.css'
import {Consumer} from '$src/context/index'
import Loadable from 'react-loadable'

const LoadableDialog = Loadable({
  loader: () => import('../.././components/Dialog/index'),
  loading () {
    return <div>Loading...</div>
  }
})

class Home extends PureComponent {
  changeState = () => {
    this.props.commit('color', 'abso')
  }

  render () {
    return (
      <div className="wrapper">
        <div>{this.props.color}<button onClick={this.changeState}>修改state</button></div>
        <LoadableDialog/>
      </div>
    )
  }
}
export default Consumer((state) => {
  return {
    position: state.pos.position,
    color: state.color
  }
})(Home)
