import Vue from 'vue'
import Router from 'vue-router'
import { store } from '../store'
import Meta from 'vue-meta'

import pages from './pages'
import auth from './auth'
import users from './user'
import smsMessage from './smsMessage'
import scheduledMessage from './scheduledMessage'
import emailTemplate from './emailTemplate'
import emailMessage from './emailMessage'
import wallet from './wallet'
import domain from './domain'
import domainWatcher from './domainWatcher'
import product from './product'
import order from './order'
import Default from '../layouts/Default'

const Dashboard = () => import('../components/dashboard/Dashboard')

Vue.use(Router)
Vue.use(Meta)

export const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  linkActiveClass: 'active',
  linkExactActiveClass: 'exact-active',
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      meta: { auth: true, label: 'داشبورد' },
      component: Default,
      children: [
        {
          path: '/dashboard',
          name: 'Dashboard',
          meta: { auth: true, label: 'داشبورد' },
          component: Dashboard
        },
        users,
        smsMessage,
        scheduledMessage,
        emailTemplate,
        emailMessage,
        domain,
        wallet,
        domainWatcher,
        product,
        order
      ]
    },
    auth,
    pages,
    { path: '*', redirect: '/pages/404' }
  ]
})

router.beforeEach((to, from, next) => {
  const authRequired = to.meta.hasOwnProperty('auth') && to.meta.auth === true
  const loggedIn = store.getters.apiKey
  const user = store.getters['user/profile/retrieved']

  if (authRequired) {
    if (!loggedIn) {
      return next({ name: 'Login', query: { redirect: to.fullPath } })
    } else if (!user && !store.getters['user/profile/isLoading']) {
      store.dispatch('user/profile/retrieve').then(() => next())
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
