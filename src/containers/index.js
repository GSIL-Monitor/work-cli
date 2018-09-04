import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import Home from '$pages/Home'

const MOUNT_NODE = document.getElementById('root')

class App extends Component {
  render () {
    return (
      <div className="app">
        <Home />
      </div>
    )
  }
}

function render () {
  ReactDOM.render(
    <AppContainer>
      <App />
    </AppContainer>,
    MOUNT_NODE
  )
}

render()

if (__DEV__ && module.hot) {
  module.hot.accept(App, render)
}
