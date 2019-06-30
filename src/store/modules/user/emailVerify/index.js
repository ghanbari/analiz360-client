import * as actions from './actions'
import * as getters from './getters'
import mutations from './mutations'

export default {
  namespaced: true,
  state: {
    error: '',
    isLoading: false,
    updated: null,
    violations: null,
    email: '',
    token: ''
  },
  actions,
  getters,
  mutations
}
