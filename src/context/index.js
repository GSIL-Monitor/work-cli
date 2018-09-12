import React, {PureComponent} from 'react'
import store from './store'
import produce from 'immer'
import setValue from 'set-value'

const Context = React.createContext()
export class Provider extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      store: store
    }
  }

  commit = (name, value) => {
    let newDraft = produce(this.state.store, (draft) => {
      setValue(draft, name, value)
    })

    this.setState({
      store: newDraft
    })
  }

  dispatch = () => {

  }

  render () {
    const { children } = this.props
    return (
      <Context.Provider
        value={{
          commit: this.commit,
          dispatch: this.dispatch,
          store: this.state.store
        }}
      >
        {children}
      </Context.Provider>
    )
  }
}

export const Consumer = (retStatesFunc) => {
  if (typeof retStatesFunc !== 'function') {
    retStatesFunc = (state) => state
  }

  return (OtherComponent) => {
    return class WrapperComponent extends PureComponent {
      render () {
        return <Context.Consumer>
          {
            context => {
              let params = retStatesFunc(context.store) || context.store
              return <OtherComponent {...params} commit={context.commit} dispatch={context.dispatch}/>
            }
          }
        </Context.Consumer>
      }
    }
  }
}
