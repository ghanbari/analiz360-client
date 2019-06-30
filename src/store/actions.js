import fetch from '../utils/fetch'
import * as types from './mutation_types'

export const login = ({ commit }, credentials) => {
  commit(types.API_KEY_SET_ERROR, '')

  return fetch('login_check', { method: 'POST', body: JSON.stringify(credentials) })
    .then(response => response.json())
    .then((data) => {
      commit(types.API_KEY_SET, data.token)
    })
    .catch(() => {
      commit(types.API_KEY_SET_ERROR, 'نام کاربری یا رمزعبور اشتباه است.')
    })
}

export const reset = ({ commit }) => {
  commit(types.RESET)
}
