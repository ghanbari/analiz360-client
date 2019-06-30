import * as types from './mutation_types'

export default {
  [types.API_KEY_SET] (state, apiKey) {
    Object.assign(state, { apiKey })
  },

  [types.RESET] (state) {
    Object.assign(state, {
      apiKey: '',
      apiKeyError: ''
    })
  },

  [types.API_KEY_SET_ERROR] (state, apiKeyError) {
    Object.assign(state, { apiKeyError })
  }
}
