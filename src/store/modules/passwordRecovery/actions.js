import SubmissionError from '../../../error/SubmissionError'
import fetch from '../../../utils/fetch'
import * as types from './mutation_types'

export const create = ({ commit }, values) => {
  commit(types.PASSWORDRECOVERY_CREATE_SET_ERROR, '')
  commit(types.PASSWORDRECOVERY_CREATE_TOGGLE_LOADING)

  return fetch('recovery', { method: 'POST', body: JSON.stringify(values) })
    .then((response) => {
      commit(types.PASSWORDRECOVERY_CREATE_TOGGLE_LOADING)

      if (response.status === 204) {
        commit(types.PASSWORDRECOVERY_CREATE_SET_CREATED, true)
      }
    })
    .catch((e) => {
      commit(types.PASSWORDRECOVERY_CREATE_TOGGLE_LOADING)

      if (e instanceof SubmissionError) {
        commit(types.PASSWORDRECOVERY_CREATE_SET_VIOLATIONS, e.errors)
        // eslint-disable-next-line
        commit(types.PASSWORDRECOVERY_CREATE_SET_ERROR, e.errors._error)
        return
      }

      commit(types.PASSWORDRECOVERY_CREATE_SET_ERROR, e.message)
    })
}

export const reset = ({ commit }) => {
  commit(types.PASSWORDRECOVERY_CREATE_RESET)
}
