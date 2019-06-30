import * as types from './mutation_types'

export default {
  [types.STATISTICS_DOMAINS_RESET] (state) {
    Object.assign(state, {
      error: '',
      isLoading: false,
      retrieved: null
    })
  },

  [types.STATISTICS_DOMAINS_SET_ERROR] (state, error) {
    Object.assign(state, { error })
  },

  [types.STATISTICS_DOMAINS_SET_RETRIEVED] (state, retrieved) {
    Object.assign(state, { retrieved })
  },

  [types.STATISTICS_DOMAINS_TOGGLE_LOADING] (state) {
    Object.assign(state, { isLoading: !state.isLoading })
  }

}
