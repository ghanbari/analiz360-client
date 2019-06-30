import fetch from '../../../../utils/fetch'
import * as types from './mutation_types'
import storage from '../../../../utils/storage'

export const retrieve = ({ commit }, options = {}) => {
  const request = () => {
    commit(types.STATISTICS_DOMAINS_TOGGLE_LOADING)

    return fetch('statistics/domains', options)
      .then(response => response.json())
      .then((data) => {
        commit(types.STATISTICS_DOMAINS_TOGGLE_LOADING)
        commit(types.STATISTICS_DOMAINS_SET_RETRIEVED, data)
        storage.setItem('/api/statistics/domains', data, 3600 * 3)
        return data
      })
      .catch((e) => {
        commit(types.STATISTICS_DOMAINS_TOGGLE_LOADING)
        commit(types.STATISTICS_DOMAINS_SET_ERROR, e.message)
      })
  }

  const reload = (data) => {
    commit(types.STATISTICS_DOMAINS_TOGGLE_LOADING)
    commit(types.STATISTICS_DOMAINS_SET_RETRIEVED, data)
    commit(types.STATISTICS_DOMAINS_TOGGLE_LOADING)
    return data
  }

  return storage.getItem('/api/statistics/domains', reload, request)
}

export const reset = ({ commit }) => {
  commit(types.STATISTICS_DOMAINS_RESET)
}
