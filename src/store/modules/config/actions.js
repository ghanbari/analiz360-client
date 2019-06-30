import fetch from '../../../utils/fetch'
import * as types from './mutation_types'
import storage from '../../../utils/storage'

export const load = ({ commit }) => {
  const request = () => {
    commit(types.CONFIG_TOGGLE_LOADING)

    return fetch('config')
      .then(response => response.json())
      .then((data) => {
        commit(types.CONFIG_TOGGLE_LOADING)
        commit(types.CONFIG_SET_CONFIGS, data)
        storage.setItem('/api/config', data, 3600 * 24)
        return data
      })
      .catch((e) => {
        commit(types.CONFIG_TOGGLE_LOADING)
        commit(types.CONFIG_SET_ERROR, e.message)
      })
  }

  const reload = (data) => {
    commit(types.CONFIG_TOGGLE_LOADING)
    commit(types.CONFIG_SET_CONFIGS, data)
    commit(types.CONFIG_TOGGLE_LOADING)
    return data
  }

  return storage.getItem('/api/config', reload, request)
}
