import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
  count: 1
}

export default new Vuex.Store({
  state,
  mutations: {
    IncreaseCount (state, test) {
      state.count = state.count + 1;
    }
  },
  actions: {
    addChildVm ({ commit, state }, vm) {

    }
  },
  getters: {
    filterChannel: state => state.filterChannel
  }
})
