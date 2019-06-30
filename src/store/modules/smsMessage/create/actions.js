import SubmissionError from '../../../../error/SubmissionError'
import fetch from '../../../../utils/fetch'
import * as types from './mutation_types'

export const create = ({ commit }, values) => {
  commit(types.SMSMESSAGE_CREATE_SET_ERROR, '')
  commit(types.SMSMESSAGE_CREATE_TOGGLE_LOADING)

  return fetch('sms_messages', { method: 'POST', body: JSON.stringify(values) })
    .then((response) => {
      commit(types.SMSMESSAGE_CREATE_TOGGLE_LOADING)

      return response.json()
    })
    .then((data) => {
      if (data['hydra:member'].length) {
        commit(types.SMSMESSAGE_CREATE_SET_CREATED, data['hydra:member'])
      }
    })
    .catch((e) => {
      commit(types.SMSMESSAGE_CREATE_TOGGLE_LOADING)

      if (e instanceof SubmissionError) {
        commit(types.SMSMESSAGE_CREATE_SET_VIOLATIONS, e.errors)
        // eslint-disable-next-line
        commit(types.SMSMESSAGE_CREATE_SET_ERROR, e.errors._error)
        return
      }

      commit(types.SMSMESSAGE_CREATE_SET_ERROR, e.message)
    })
}

export const reset = ({ commit }) => {
  commit(types.SMSMESSAGE_CREATE_RESET)
}
