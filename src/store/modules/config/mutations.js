import * as types from './mutation_types'

export default {
  [types.CONFIG_RESET] (state) {
    Object.assign(state, {
      error: '',
      isLoading: false,
      configs: null
    })
  },

  [types.CONFIG_SET_ERROR] (state, error) {
    Object.assign(state, { error })
  },

  [types.CONFIG_SET_CONFIGS] (state, configs) {
    Object.assign(state, { configs })
  },

  [types.CONFIG_TOGGLE_LOADING] (state) {
    Object.assign(state, { isLoading: !state.isLoading })
  }

}
