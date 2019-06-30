import * as types from './mutation_types'

export default {
  [types.MEDIA_DELETE_SET_DELETED] (state, deleted) {
    Object.assign(state, { deleted })
  },

  [types.MEDIA_DELETE_SET_ERROR] (state, error) {
    Object.assign(state, { error })
  },

  [types.MEDIA_DELETE_TOGGLE_LOADING] (state) {
    Object.assign(state, { isLoading: !state.isLoading })
  },

  [types.MEDIA_DELETE_RESET] (state) {
    Object.assign(state, {
      deleted: null,
      error: '',
      isLoading: false
    })
  }
}
