import fetch from '../../../../utils/fetch'
import * as types from './mutation_types'

export const getItems = ({ commit }, options) => {
  commit(types.TOGGLE_LOADING)

  fetch('email_templates', options)
    .then(response => response.json())
    .then((data) => {
      commit(types.TOGGLE_LOADING)
      commit(types.SET_ITEMS, data['hydra:member'])
    })
    .catch((e) => {
      commit(types.TOGGLE_LOADING)
      commit(types.SET_ERROR, e.message)
    })
}

export const reset = ({ commit }) => {
  commit(types.RESET)
}
