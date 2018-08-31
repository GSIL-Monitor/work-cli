import React, { PureComponent } from 'react'
import Button from '../button'
export default class Subject extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      items: []
    }

    this.styles = {
      border: '1px solid #FFFFFF',
      marginTop: '16px',
      color: '#ffffff',
      paddingLeft: '22px'
    }
  }

  UNSAFE_componentWillReceiveProps (newProps, oldProps) {
    this.setState({
      items: newProps.items
    })
  }

  render () {
    let {items} = this.state
    return <div className="subject">
      {
        items.map((item, key) => {
          return <Button onClick={this.props.action_select}
            model='answer' key={key} index={key}
            id={item.option_id} text={item.text}
            pos="left" type={item.type} />
        })
      }
    </div>
  }
}
