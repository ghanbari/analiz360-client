import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import localforage from 'localforage'
import * as actions from './actions'
import * as getters from './getters'
import mutations from './mutations'
import user from './modules/user'
import province from './modules/province'
import city from './modules/city'
import media from './modules/media'
import smsMessage from './modules/smsMessage'
import scheduledMessage from './modules/scheduledMessage'
import emailTemplate from './modules/emailTemplate'
import emailMessage from './modules/emailMessage'
import config from './modules/config'
import oneTimePassword from './modules/oneTimePassword'
import passwordRecovery from './modules/passwordRecovery'
import statistics from './modules/statistics'
import domain from './modules/domain'
import wallet from './modules/wallet'
import domainWatcher from './modules/domainWatcher'
import product from './modules/product'
import order from './modules/order'

Vue.use(Vuex)

const storeOptions = {
  strict: process.env.NODE_ENV !== 'production',
  state: {
    apiKey: '',
    apiKeyError: ''
  },
  getters,
  mutations,
  modules: {
    user,
    province,
    city,
    media,
    smsMessage,
    scheduledMessage,
    emailTemplate,
    emailMessage,
    config,
    oneTimePassword,
    passwordRecovery,
    statistics,
    domain,
    wallet,
    domainWatcher,
    product,
    order
  },
  plugins: [createPersistedState()]
}

const logout = (store) => {
  const resetAll = function (module, path) {
    if (module.hasOwnProperty('actions') && module.actions.hasOwnProperty('reset')) {
      store.dispatch([...path, 'reset'].join('/'))
    }

    if (module.hasOwnProperty('modules')) {
      for (const child in module.modules) {
        resetAll(module.modules[child], [...path, child])
      }
    }
  }

  store.dispatch('reset').then(() => {
    resetAll(storeOptions, [])
    localforage.clear()
  })
}

export const store = new Vuex.Store({
  ...storeOptions,
  actions: {
    ...actions,
    logout
  }
})
