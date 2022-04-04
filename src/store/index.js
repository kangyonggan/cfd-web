import { createStore } from 'vuex'

export default createStore({
  state: {
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || {},
    quotationMap: {},
  },
  mutations: {
    setUserInfo(state, userInfo) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
      state.userInfo = userInfo
    },
    setQuotationMap(state, quotationMap) {
      state.quotationMap = quotationMap
    },
  },
  getters: {
    getUserInfo(state) {
      return state.userInfo
    },
    getQuotationMap(state) {
      return state.quotationMap
    },
  },
  actions: {
  },
  modules: {
  }
})
