import * as types from './mutation_types'

export default {
  [types.ONETIMEPASSWORD_CREATE_SET_ERROR] (state, error) {
    Object.assign(state, { error })
  },

  [types.ONETIMEPASSWORD_CREATE_TOGGLE_LOADING] (state) {
    Object.assign(state, { isLoading: !state.isLoading })
  },

  [types.ONETIMEPASSWORD_CREATE_SET_CREATED] (state, created) {
    Object.assign(state, { created })
  },

  [types.ONETIMEPASSWORD_CREATE_SET_TIMER] (state, timer) {
    Object.assign(state, { timer })
  },

  [types.ONETIMEPASSWORD_CREATE_RESET] (state) {
    Object.assign(state, {
      created: null,
      error: '',
      isLoading: false,
      timer: null
    })
  }
}
