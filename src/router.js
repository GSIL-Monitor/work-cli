import React from 'react'
import { Router, Route } from 'react-router-dom'
import Home from './pages/Home/index'
// import Loadable from 'react-loadable';
// import Loading  from '$components/loading.js'

// const Home = Loadable({
//   loader: () => import( /* webpackChunkName: "Home" */ "./pages/Home/index.js"),
//   loading: Loading
// });

let router = ({ history }) => {
  return (
    <Router history={history}>
      <Route path="/" component={Home} />
    </Router>
  )
}

export default router
