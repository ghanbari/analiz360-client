import fetch from '../../../../utils/fetch'
import * as types from './mutation_types'
import storage from '../../../../utils/storage'

export const retrieve = ({ commit }, domain) => {
  const request = () => {
    commit(types.DOMAIN_SHOW_TOGGLE_LOADING)

    return fetch(`domains/${domain}`)
      .then(response => response.json())
      .then((data) => {
        commit(types.DOMAIN_SHOW_TOGGLE_LOADING)
        commit(types.DOMAIN_SHOW_SET_RETRIEVED, data)
        storage.setItem(`domains/${domain}`, data, 3600)
        return data
      })
      .catch((e) => {
        commit(types.DOMAIN_SHOW_TOGGLE_LOADING)
        commit(types.DOMAIN_SHOW_SET_ERROR, `دامنه ${domain} یافت نشد`)
      })
  }

  const reload = (data) => {
    commit(types.DOMAIN_SHOW_TOGGLE_LOADING)
    commit(types.DOMAIN_SHOW_SET_RETRIEVED, data)
    commit(types.DOMAIN_SHOW_TOGGLE_LOADING)
    return data
  }

  return storage.getItem(`domains/${domain}`, reload, request)
}

export const reset = ({ commit }) => {
  commit(types.DOMAIN_SHOW_RESET)
}
