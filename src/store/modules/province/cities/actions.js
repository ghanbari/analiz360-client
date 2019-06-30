import fetch from '../../../../utils/fetch'
import * as types from './mutation_types'
import storage from '../../../../utils/storage'

export const getItems = ({ commit }, options) => {
  const request = () => {
    commit(types.TOGGLE_LOADING)

    return fetch(`${options.province}/cities`, options)
      .then(response => response.json())
      .then((data) => {
        commit(types.TOGGLE_LOADING)
        commit(types.SET_ITEMS, data['hydra:member'])
        storage.setItem(`${options.province}/cities`, data['hydra:member'], 3600 * 24 * 10)
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

  return storage.getItem(`${options.province}/cities`, reload, request)
}

export const reset = ({ commit }) => {
  commit(types.RESET)
}

export const flush = ({ commit }, provinceId) => {
  if (provinceId) {
    storage.removeItem(`${provinceId}/cities`, () => {
      commit(types.RESET)
    })
  } else {
    storage.removeItems(new RegExp('^storage:/api/provinces/(\\d)/cities'), () => {
      commit(types.RESET)
    })
  }
}
