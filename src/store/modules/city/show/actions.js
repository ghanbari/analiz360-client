import fetch from '../../../../utils/fetch'
import * as types from './mutation_types'
import storage from '../../../../utils/storage'

export const retrieve = ({ commit }, options) => {
  const request = () => {
    commit(types.CITY_SHOW_TOGGLE_LOADING)

    return fetch(options.id)
      .then(response => response.json())
      .then((data) => {
        commit(types.CITY_SHOW_TOGGLE_LOADING)
        commit(types.CITY_SHOW_SET_RETRIEVED, data)
        storage.setItem(options.id, data, 3600 * 24 * 10)
        return data
      })
      .catch((e) => {
        commit(types.CITY_SHOW_TOGGLE_LOADING)
        commit(types.CITY_SHOW_SET_ERROR, e.message)
      })
  }

  const reload = (data) => {
    commit(types.CITY_SHOW_TOGGLE_LOADING)
    commit(types.CITY_SHOW_SET_RETRIEVED, data)
    commit(types.CITY_SHOW_TOGGLE_LOADING)
    return data
  }

  return storage.getItem(options.id, reload, request)
}

export const reset = ({ commit }) => {
  commit(types.CITY_SHOW_RESET)
}

export const flush = ({ commit }, cityId) => {
  if (cityId) {
    storage.removeItem(cityId, () => {
      commit(types.CITY_SHOW_RESET)
    })
  } else {
    storage.removeItems(new RegExp('^storage:/api/cities/(\\d)'), () => {
      commit(types.CITY_SHOW_RESET)
    })
  }
}
