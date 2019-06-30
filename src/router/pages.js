const Page404 = () => import('../views/errors/Error404')
const Page500 = () => import('../views/errors/Error500')

export default {
  path: '/pages',
  redirect: '/pages/404',
  name: 'Pages',
  component: {
    render (c) {
      return c('router-view')
    }
  },
  children: [
    {
      path: '404',
      name: 'Page404',
      component: Page404,
      meta: {
        title: 'صفحه مورد نظر یافت نشد'
      }
    },
    {
      path: '500',
      name: 'Page500',
      component: Page500
    }
  ]
}
