import Home from '$pages/Home/index.vue'

export default [
  { path: '/', redirect: '/home' },
  {
    path: '/home',
    component: Home
  }
]
