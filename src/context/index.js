import React, {PureComponent} from 'react'
import store from './store'
import produce from 'immer'
import setValue from 'set-value'

const {Provider, Consumer} = React.createContext()
export class ContextProvider extends PureComponent {
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
      <Provider
        value={{
          commit: this.commit,
          dispatch: this.dispatch,
          store: this.state.store
        }}
      >
        {children}
      </Provider>
    )
  }
}

export const ContextConsumer = (retStatesFunc) => {
  if (typeof retStatesFunc !== 'function') {
    retStatesFunc = (state) => state
  }

  return (OtherComponent) => {
    return class WrapperComponent extends PureComponent {
      render () {
        return <Consumer>
          {
            context => {
              let params = retStatesFunc(context.store) || context.store
              return <OtherComponent {...params} commit={context.commit} dispatch={context.dispatch}/>
            }
          }
        </Consumer>
      }
    }
  }
}
