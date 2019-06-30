const DomainList = () => import('../components/domain/List')
const DomainCreate = () => import('../components/domain/Create')
const DomainUpdate = () => import('../components/domain/Update')
const DomainShow = () => import('../views/domain/Show')

export default {
  name: 'Domains',
  path: '/domains',
  meta: { auth: true, label: 'دامنه ها', role: 'ROLE_ADMIN' },
  component: {
    render (c) {
      return c('router-view')
    }
  },
  children: [
    { name: 'DomainList', path: '/domains/list', component: DomainList, meta: { auth: true, label: 'مشاهده دامنه ها' } },
    { name: 'DomainCreate', path: '/domains/create', component: DomainCreate, meta: { auth: true, label: 'افزودن دامنه' } },
    { name: 'DomainUpdate', path: '/domains/edit/:id', component: DomainUpdate, meta: { auth: true, label: 'ویرایش دامنه' } },
    { name: 'DomainShow', path: '/domains/show/:domain', component: DomainShow, meta: { auth: true, label: 'نمایش دامنه' } }
  ]
}
