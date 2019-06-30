import Vue from 'vue'
import ShardsVue from 'shards-vue'
import BootstrapVue from 'bootstrap-vue'
import { sync } from 'vuex-router-sync'
import VueProgressBar from 'vue-progressbar'
import VeeValidate, { Validator } from 'vee-validate'
import fa from 'vee-validate/dist/locale/fa'

import VueAnalytics from 'vue-analytics'
import Toasted from 'vue-toasted'
import App from './App'
import { router } from './router'
import { store } from './store'
import RemoteConfigPlugin from './plugins/remoteConfig'
import ConfigPlugin from './plugins/config'
import userPlugin from './plugins/user'
import storagePlugin from './plugins/storage'
import Config from './config'
import configFile from './config/config'
import './registerServiceWorker'

Vue.config.productionTip = false

Vue.use(ConfigPlugin)
Vue.use(userPlugin)
Vue.use(RemoteConfigPlugin)
Vue.use(storagePlugin)
Vue.use(BootstrapVue)
ShardsVue.install(Vue)
sync(store, router)

Vue.use(VeeValidate, {
  inject: true,
  fieldsBagName: 'veeFields',
  errorBagName: 'veeErrors'
})
Validator.localize('fa', fa)

const config = new Config(configFile)

Vue.use(VueProgressBar, {
  color: config.get('progressBar.color', '#04afe2'),
  failedColor: config.get('progressBar.failedColor', '#874b4b'),
  height: config.get('progressBar.height', '2px'),
  thickness: config.get('progressBar.thickness', '3px'),
  transition: {
    speed: '0.2s',
    opacity: '0.6s',
    termination: 400
  },
  autoRevert: true,
  inverse: false
})

Vue.use(Toasted, {
  position: 'bottom-left',
  duration: 5000,
  iconPack: 'custom-class',
  type: 'info',
  theme: 'bubble',
  icon: { name: 'icon-globe', after: false },
  action: {
    text: '',
    class: 'icon-cancel',
    onClick: (e, toastObject) => {
      toastObject.goAway(0)
    }
  }
})

Vue.use(VueAnalytics, {
  router,
  id: config.get('google.analytics.id', ''),
  autoTracking: {
    screenview: true,
    exception: true
  },
  ecommerce: {
    enabled: true,
    enhanced: true
  },
  debug: {
    sendHitTask: process.env.NODE_ENV === 'production',
    enabled: false,
    // trace: process.env.NODE_ENV !== 'production',
  },
  batch: {
    enabled: true,
    amount: 2,
    delay: 500
  }
})

Vue.prototype.$eventHub = new Vue()

export default new Vue({
  router,
  components: {
    App
  },
  computed: {
    apiKey () {
      return this.$store.state.apiKey
    }
  },
  watch: {
    apiKey (val) {
      if (val === '') {
        this.$router.replace({ name: 'Login', query: { redirect: this.$route.fullPath } })
      }
    }
  },
  template: '<App/>',
  store
}).$mount('#app')
