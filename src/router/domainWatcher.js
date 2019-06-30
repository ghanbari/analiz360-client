const DomainWatcherList = () => import('../components/domainWatcher/List')

export default {
  path: 'domain_watchers',
  meta: { auth: true, label: 'دامنه های من' },
  component: {
    render (c) {
      return c('router-view')
    }
  },
  children: [
    { name: 'DomainWatcherList', path: '/domain_watchers/', component: DomainWatcherList, meta: { auth: true, label: 'مشاهده دامنه ها' } }
  ]
}
