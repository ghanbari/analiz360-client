import fetch from '../../../utils/fetch'
import * as types from './mutation_types'
import AccessDeniedError from '../../../error/AccessDeniedError'
import BadRequestError from '../../../error/BadRequestError'

export const create = ({ commit }, values) => {
  commit(types.ONETIMEPASSWORD_CREATE_SET_ERROR, '')
  commit(types.ONETIMEPASSWORD_CREATE_TOGGLE_LOADING)

  return fetch('one_time_passwords', { method: 'POST', body: JSON.stringify(values) })
    .then((response) => {
      commit(types.ONETIMEPASSWORD_CREATE_TOGGLE_LOADING)

      return response.json()
    })
    .then((data) => {
      commit(types.ONETIMEPASSWORD_CREATE_SET_CREATED, data)
    })
    .catch((e) => {
      commit(types.ONETIMEPASSWORD_CREATE_TOGGLE_LOADING)

      if (e instanceof AccessDeniedError) {
        // eslint-disable-next-line
        commit(types.ONETIMEPASSWORD_CREATE_SET_ERROR, e.error)

        return
      }

      if (e instanceof BadRequestError) {
        // eslint-disable-next-line
        commit(types.ONETIMEPASSWORD_CREATE_SET_CREATED, e.response.message);
        commit(types.ONETIMEPASSWORD_CREATE_SET_TIMER, e.response.remainTime)
        // let resetAt = Math.floor((new Date()).getTime() / 1000) + state.timer;
        // let timer = setInterval(() => {
        //   let remainTime = resetAt - (Math.floor((new Date()).getTime() / 1000));
        //   if (remainTime <= 0) {
        //     clearInterval(timer);
        //   }
        //   commit(types.ONETIMEPASSWORD_CREATE_SET_TIMER, remainTime);
        // }, 1000);

        return
      }

      commit(types.ONETIMEPASSWORD_CREATE_SET_ERROR, e.message)
    })
}

export const reset = ({ commit }) => {
  commit(types.ONETIMEPASSWORD_CREATE_RESET)
}
