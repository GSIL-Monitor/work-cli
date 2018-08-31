import React, { PureComponent } from 'react'
import './style.css'
import TopSpot from 'Component/topSpot'
import RankAtom from 'Component/rankAtom'
import request from 'Service/index'
import MyHead from 'Component/header'
import { sendTeaEnterEvent } from 'Asset/utils/tea_utils'

class RankList extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      rank: []
    }
  }

  componentDidMount () {
    sendTeaEnterEvent({
      page_id: 'page_honor_battle_rank'
    })
    request.get('/motor/sf/game/ranklist').then(res => {
      this.setState({
        rank: res.status.code === 0 ? res.data.rank : []
      })
    })
  }

  render () {
    let { rank } = this.state
    let [first, second, third, ...rest] = rank
    return (
      <div className="page-ranklist">
        <MyHead text="挑战排行榜" />
        <div className="ranklist-topspot-list">
          {second && <TopSpot model={second}/> }
          {first && <TopSpot model={first}/> }
          {third && <TopSpot model={third}/> }
        </div>
        <div className="ranklist-listitem">
          {
            rest.map(item => {
              return <RankAtom model={item} key={item.rank}/>
            })
          }
        </div>
      </div>
    )
  }
}

export default RankList
