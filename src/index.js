import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './app.vue'
import routes from './router.js'
import store from './store/store'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default new Vue({
  el: '#root',
  router,
  store,
  render: h => h(App)
})
