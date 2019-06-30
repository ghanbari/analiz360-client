import fetch from '../../../../utils/fetch'
import * as types from './mutation_types'
import storage from '../../../../utils/storage'

export const retrieve = ({ commit }, id) => {
  const request = () => {
    commit(types.USER_STATISTICS_TOGGLE_LOADING)

    return fetch(`statistics/users/${id}`)
      .then(response => response.json())
      .then((data) => {
        commit(types.USER_STATISTICS_TOGGLE_LOADING)
        commit(types.USER_STATISTICS_SET_RETRIEVED, data)
        storage.setItem(`/api/statistics/users/${id}`, data, 3600 * 24 * 10)
        return data
      })
      .catch((e) => {
        commit(types.USER_STATISTICS_TOGGLE_LOADING)
        commit(types.USER_STATISTICS_SET_ERROR, e.message)
      })
  }

  const reload = (data) => {
    commit(types.USER_STATISTICS_TOGGLE_LOADING)
    commit(types.USER_STATISTICS_SET_RETRIEVED, data)
    commit(types.USER_STATISTICS_TOGGLE_LOADING)
    return data
  }

  return storage.getItem(`/api/statistics/users/${id}`, reload, request)
}

export const reset = ({ commit }) => {
  commit(types.USER_STATISTICS_RESET)
}
