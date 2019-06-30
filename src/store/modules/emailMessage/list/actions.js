import fetch from '../../../../utils/fetch'
import * as types from './mutation_types'

export const getItems = ({ commit }, options) => {
  commit(types.TOGGLE_LOADING)

  const page = `email_messages${options && options.hasOwnProperty('page') ? `?page=${options.page}` : ''}`

  fetch(page, options)
    .then(response => response.json())
    .then((data) => {
      commit(types.TOGGLE_LOADING)
      commit(types.SET_ITEMS, data['hydra:member'])
      commit(types.SET_VIEW, data['hydra:view'])
      commit(types.SET_TOTAL_ITEMS, data['hydra:totalItems'])
    })
    .catch((e) => {
      commit(types.TOGGLE_LOADING)
      commit(types.SET_ERROR, e.message)
    })
}

export const setFields = ({ commit }, fields) => {
  commit(types.SET_FIELDS, fields)
}

export const removeItem = ({ commit }, item) => {
  commit(types.REMOVE_ITEM, item)
}

export const reset = ({ commit }) => {
  commit(types.RESET)
}
