import SubmissionError from '../../../../error/SubmissionError'
import fetch from '../../../../utils/fetch'
import * as types from './mutation_types'

export const create = ({ commit }, values) => {
  commit(types.EMAILMESSAGE_CREATE_SET_ERROR, '')
  commit(types.EMAILMESSAGE_CREATE_TOGGLE_LOADING)

  return fetch('email_messages', { method: 'POST', body: JSON.stringify(values) })
    .then((response) => {
      commit(types.EMAILMESSAGE_CREATE_TOGGLE_LOADING)

      return response.json()
    })
    .then((data) => {
      commit(types.EMAILMESSAGE_CREATE_SET_CREATED, data)
    })
    .catch((e) => {
      commit(types.EMAILMESSAGE_CREATE_TOGGLE_LOADING)

      if (e instanceof SubmissionError) {
        commit(types.EMAILMESSAGE_CREATE_SET_VIOLATIONS, e.errors)
        // eslint-disable-next-line
        commit(types.EMAILMESSAGE_CREATE_SET_ERROR, e.errors._error)
        return
      }

      commit(types.EMAILMESSAGE_CREATE_SET_ERROR, e.message)
    })
}

export const reset = ({ commit }) => {
  commit(types.EMAILMESSAGE_CREATE_RESET)
}
