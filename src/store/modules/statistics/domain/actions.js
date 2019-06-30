import fetch from '../../../../utils/fetch'
import * as types from './mutation_types'
import storage from '../../../../utils/storage'
import AccessDeniedError from '../../../../error/AccessDeniedError'

export const retrieve = ({ commit }, options) => {
  const query = options.hasOwnProperty('query') ? `?${JSON.stringify(options.query)}` : ''

  const request = () => {
    commit(types.DOMAIN_STATISTICS_TOGGLE_LOADING)

    return fetch(`statistics/domains/${options.id}`, options)
      .then(response => response.json())
      .then((data) => {
        commit(types.DOMAIN_STATISTICS_TOGGLE_LOADING)
        commit(types.DOMAIN_STATISTICS_SET_RETRIEVED, data)
        storage.setItem(`/api/statistics/domains/${options.id}${query}`, data, 30 * 24 * 3600)
        return data
      })
      .catch((e) => {
        commit(types.DOMAIN_STATISTICS_TOGGLE_LOADING)
        if (e instanceof AccessDeniedError) {
          commit(types.DOMAIN_STATISTICS_SET_ERROR, 'شما به محدودیت مشاهده رایگان رسیده اید، برای مشاهده اطلاعات این دامنه باید پلنی برای ان خریداری نموده و یا فردا مجددا تلاش نمایید.')
        } else {
          commit(types.DOMAIN_STATISTICS_SET_ERROR, e.message)
        }
      })
  }

  const reload = (data) => {
    commit(types.DOMAIN_STATISTICS_TOGGLE_LOADING)
    commit(types.DOMAIN_STATISTICS_SET_RETRIEVED, data)
    commit(types.DOMAIN_STATISTICS_TOGGLE_LOADING)
    return data
  }

  return storage.getItem(`/api/statistics/domains/${options.id}${query}`, reload, request)
}

export const reset = ({ commit }) => {
  commit(types.DOMAIN_STATISTICS_RESET)
}
