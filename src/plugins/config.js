import { Config } from '../config'
import configFile from '../config/config'

export default {
  install (Vue, options) {
    Vue.prototype.$config = new Config((options && options.hasOwnProperty('config') && options.config) || configFile || {})
  }
}
