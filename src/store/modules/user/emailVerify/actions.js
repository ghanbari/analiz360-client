import SubmissionError from '../../../../error/SubmissionError'
import AccessDeniedError from '../../../../error/AccessDeniedError'
import fetch from '../../../../utils/fetch'
import * as types from './mutation_types'

export const reset = ({ commit }) => {
  commit(types.RESET)
}

export const verify = ({ commit, state }) => {
  commit(types.SET_ERROR, '')
  commit(types.TOGGLE_LOADING)

  return fetch('profile/email/verify', {
    method: 'PUT',
    headers: new Headers({ 'Content-Type': 'application/ld+json' }),
    body: JSON.stringify({ email: state.email, token: state.token })
  })
    .then(response => response.json())
    .then((data) => {
      commit(types.TOGGLE_LOADING)
      commit(types.SET_UPDATED, data)
    })
    .catch((e) => {
      commit(types.TOGGLE_LOADING)

      if (e instanceof AccessDeniedError) {
        // eslint-disable-next-line
        commit(types.SET_ERROR, e.error)

        return
      }

      if (e instanceof SubmissionError) {
        commit(types.SET_VIOLATIONS, e.errors)
        // eslint-disable-next-line
        commit(types.SET_ERROR, e.errors._error)

        return
      }

      // eslint-disable-next-line
      commit(commit(types.SET_ERROR, e.errors._error))
    })
}

export const setEmail = ({ commit }, email) => {
  commit(types.SET_EMAIL, email)
}

export const setToken = ({ commit }, token) => {
  commit(types.SET_TOKEN, token)
}
