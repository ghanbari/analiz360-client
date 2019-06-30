import * as types from './mutation_types'

export default {
  [types.RESET] (state) {
    Object.assign(state, {
      error: '',
      isLoading: false,
      updated: null,
      violations: null,
      email: '',
      token: ''
    })
  },

  [types.SET_ERROR] (state, error) {
    Object.assign(state, { error })
  },

  [types.TOGGLE_LOADING] (state) {
    Object.assign(state, { isLoading: !state.isLoading })
  },

  [types.SET_UPDATED] (state, updated) {
    Object.assign(state, { error: '', updated, violations: null })
  },

  [types.SET_VIOLATIONS] (state, violations) {
    Object.assign(state, { violations })
  },

  [types.SET_EMAIL] (state, email) {
    Object.assign(state, { email })
  },

  [types.SET_TOKEN] (state, token) {
    Object.assign(state, { token })
  }
}
