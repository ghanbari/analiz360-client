import fetch from '../../../../utils/fetch'
import * as types from './mutation_types'
import storage from '../../../../utils/storage'

export const getItems = ({ commit }, options) => {
  const query = options.hasOwnProperty('query') ? options.query : {}

  const request = () => {
    commit(types.TOGGLE_LOADING)

    return fetch('products', options)
      .then(response => response.json())
      .then((data) => {
        commit(types.TOGGLE_LOADING)
        commit(types.SET_ITEMS, data['hydra:member'])
        commit(types.SET_VIEW, data['hydra:view'])
        commit(types.SET_TOTAL_ITEMS, data['hydra:totalItems'])
        storage.setItem(`products?${JSON.stringify(query)}`, data['hydra:member'], 3600)
        return data['hydra:member']
      })
      .catch((e) => {
        commit(types.TOGGLE_LOADING)
        commit(types.SET_ERROR, e.message)
      })
  }

  const reload = (data) => {
    commit(types.TOGGLE_LOADING)
    commit(types.SET_ITEMS, data)
    commit(types.TOGGLE_LOADING)
    return data
  }

  return storage.getItem(`products?${JSON.stringify(query)}`, reload, request)
}

export const setFields = ({ commit }, fields) => {
  commit(types.SET_FIELDS, fields)
}

export const reset = ({ commit }) => {
  commit(types.RESET)
}
