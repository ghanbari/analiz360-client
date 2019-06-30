import { set } from 'vue-analytics'
import fetch from '../../../../utils/fetch'
import * as types from './mutation_types'
import storage from '../../../../utils/storage'

export const retrieve = ({ commit }, options = {}) => {
  const request = () => {
    commit(types.USER_PROFILE_TOGGLE_LOADING)

    return fetch('profile', options)
      .then(response => response.json())
      .then((data) => {
        commit(types.USER_PROFILE_TOGGLE_LOADING)
        commit(types.USER_PROFILE_SET_RETRIEVED, data)
        storage.setItem('/api/profile', Object.freeze(data), 3600)
        set('userId', data.username)
        return data
      })
      .catch((e) => {
        commit(types.USER_PROFILE_TOGGLE_LOADING)
        commit(types.USER_PROFILE_SET_ERROR, e.message)
      })
  }

  const reload = (data) => {
    commit(types.USER_PROFILE_TOGGLE_LOADING)
    commit(types.USER_PROFILE_SET_RETRIEVED, data)
    commit(types.USER_PROFILE_TOGGLE_LOADING)
    set('userId', data.username)
    return data
  }

  if (options.hasOwnProperty('fresh') && options.fresh) {
    return request()
  }
  return storage.getItem('/api/profile', reload, request)
}

export const reset = ({ commit }) => {
  commit(types.USER_PROFILE_RESET)
}

export const flush = ({ commit }) => {
  storage.removeItem('/api/profile', () => {
    commit(types.USER_PROFILE_RESET)
  })
}
