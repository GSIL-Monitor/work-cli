import React, { PureComponent } from 'react'
import './style.css'
import { connect } from 'dva'
class Home extends PureComponent {
  constructor () {
    super()
    this.state = {
      position: ''
    }
  }

  componentDidMount () {
    this.props.dispatch({

    })
  }

  render () {
    return (
      <div>
        <p>{this.props.color}</p>
        <button onClick={this.changeState}>修改state</button>
      </div>
    )
  }
}

export default connect((state) => {
  return {
    color: state.example.color
  }
})(Home)
