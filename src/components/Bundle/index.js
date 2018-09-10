import React from 'react'

/**
 * 为了解决react-router4 的按需加载，需配合bundle-loader来做处理
 *
 */
class Bundle extends React.Component {
  constructor () {
    super(...arguments)
    this.state = {
      // short for "module" but that's a keyword in js, so "mod"
      mod: null
    }
  }

  UNSAFE_componentWillMount () {
    this.load(this.props)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps)
    }
  }

  load (props) {
    this.setState({
      mod: null
    })
    props.load((mod) => {
      this.setState({
        // handle both es imports and cjs
        mod: mod.default ? mod.default : mod
      })
    })
  }

  render () {
    return this.state.mod ? this.props.children(this.state.mod) : null
  }
}

export default Bundle
