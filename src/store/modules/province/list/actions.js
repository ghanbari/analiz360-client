import fetch from '../../../../utils/fetch'
import * as types from './mutation_types'
import storage from '../../../../utils/storage'

const storageKey = '/api/provinces'

export const getItems = ({ commit }, options) => {
  const request = () => {
    commit(types.TOGGLE_LOADING)

    return fetch('provinces', options)
      .then(response => response.json())
      .then((data) => {
        commit(types.TOGGLE_LOADING)
        commit(types.SET_ITEMS, data['hydra:member'])
        storage.setItem(storageKey, data['hydra:member'], 3600 * 24 * 10)
        return data['hydra:member']
      })
      .catch((e) => {
        commit(types.TOGGLE_LOADING)
        commit(types.SET_ERROR, e.message)
      })
  }

  const reload = (value) => {
    commit(types.TOGGLE_LOADING)
    commit(types.SET_ITEMS, value)
    commit(types.TOGGLE_LOADING)
    return value
  }

  return storage.getItem(storageKey, reload, request)
}

export const flush = ({ commit }) => {
  storage.removeItem(storageKey, () => {
    commit(types.RESET)
  })
}
