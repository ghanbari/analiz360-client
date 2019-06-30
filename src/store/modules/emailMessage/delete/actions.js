import fetch from '../../../../utils/fetch'
import * as types from './mutation_types'

export const del = ({ commit }, item) => {
  commit(types.EMAILMESSAGE_DELETE_TOGGLE_LOADING)

  return fetch(item['@id'], { method: 'DELETE' })
    .then(() => {
      commit(types.EMAILMESSAGE_DELETE_TOGGLE_LOADING)
      commit(types.EMAILMESSAGE_DELETE_SET_DELETED, item)
    })
    .catch((e) => {
      commit(types.EMAILMESSAGE_DELETE_TOGGLE_LOADING)
      commit(types.EMAILMESSAGE_DELETE_SET_ERROR, e.message)
    })
}

export const reset = ({ commit }) => {
  commit(types.EMAILMESSAGE_DELETE_RESET)
}
