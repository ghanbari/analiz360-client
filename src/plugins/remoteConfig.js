import cloneDeep from 'lodash/cloneDeep'
import { Config } from '../config'
import { store } from '../store'

export default {
  install (Vue) {
    store.dispatch('config/load')

    Vue.mixin({
      computed: {
        $remoteConfig () {
          return new Config(cloneDeep(this.$store.getters['config/configs']) || {})
        }
      }
    })
  }
}
