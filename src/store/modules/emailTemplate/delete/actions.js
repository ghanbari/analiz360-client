import fetch from '../../../../utils/fetch'
import * as types from './mutation_types'
import ConflictError from '../../../../error/ConflictError'

export const del = ({ commit }, item) => {
  commit(types.EMAILTEMPLATE_DELETE_TOGGLE_LOADING)

  return fetch(item['@id'], { method: 'DELETE' })
    .then(() => {
      commit(types.EMAILTEMPLATE_DELETE_TOGGLE_LOADING)
      commit(types.EMAILTEMPLATE_DELETE_SET_DELETED, item)
    })
    .catch((e) => {
      commit(types.EMAILTEMPLATE_DELETE_TOGGLE_LOADING)
      if (e instanceof ConflictError) {
        commit(types.EMAILTEMPLATE_DELETE_SET_ERROR, 'این قالب استفاده شده است و امکان حذف آن وجود ندارد.')
      } else {
        commit(types.EMAILTEMPLATE_DELETE_SET_ERROR, e.message)
      }
    })
}

export const reset = ({ commit }) => {
  commit(types.EMAILTEMPLATE_DELETE_RESET)
}
