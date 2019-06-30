import fetch from '../../../../utils/fetch'
import * as types from './mutation_types'
import storage from '../../../../utils/storage'

export const retrieve = ({ commit }, id) => {
  const request = () => {
    commit(types.PRODUCT_SHOW_TOGGLE_LOADING)

    return fetch(id)
      .then(response => response.json())
      .then((data) => {
        commit(types.PRODUCT_SHOW_TOGGLE_LOADING)
        commit(types.PRODUCT_SHOW_SET_RETRIEVED, data)
        storage.setItem(id, data, 3600)
        return data
      })
      .catch((e) => {
        commit(types.PRODUCT_SHOW_TOGGLE_LOADING)
        commit(types.PRODUCT_SHOW_SET_ERROR, e.message)
      })
  }

  const reload = (data) => {
    commit(types.PRODUCT_SHOW_TOGGLE_LOADING)
    commit(types.PRODUCT_SHOW_SET_RETRIEVED, data)
    commit(types.PRODUCT_SHOW_TOGGLE_LOADING)
    return data
  }

  return storage.getItem(id, reload, request)
}

export const reset = ({ commit }) => {
  commit(types.PRODUCT_SHOW_RESET)
}
