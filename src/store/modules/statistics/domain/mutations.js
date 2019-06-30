import * as types from './mutation_types'

export default {
  [types.DOMAIN_STATISTICS_RESET] (state) {
    Object.assign(state, {
      error: '',
      isLoading: false,
      retrieved: null
    })
  },

  [types.DOMAIN_STATISTICS_SET_ERROR] (state, error) {
    Object.assign(state, { error })
  },

  [types.DOMAIN_STATISTICS_SET_RETRIEVED] (state, retrieved) {
    Object.assign(state, { retrieved })
  },

  [types.DOMAIN_STATISTICS_TOGGLE_LOADING] (state) {
    Object.assign(state, { isLoading: !state.isLoading })
  }

}
