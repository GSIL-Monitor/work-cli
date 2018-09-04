import React, { PureComponent } from 'react'
import './style.css'
import { helloworld } from '$utils/test'
class Home extends PureComponent {
  render () {
    return (
      <div>3333333333333{helloworld()}</div>
    )
  }
}

export default Home
