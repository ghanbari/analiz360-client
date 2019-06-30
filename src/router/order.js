const OrderList = () => import('../components/order/List')
const OrderCreate = () => import('../components/order/Create')
const OrderShow = () => import('../components/order/Show')
const OrderConfirm = () => import('../components/order/Confirm')

export default {
  path: 'orders',
  meta: { auth: true, label: 'خریدها' },
  component: {
    render (c) {
      return c('router-view')
    }
  },
  children: [
    { name: 'OrderList', path: '/orders/', component: OrderList, meta: { auth: true, label: 'مشاهده خریدها' } },
    { name: 'OrderConfirm', path: '/orders/confirm/', component: OrderConfirm, meta: { auth: true, label: 'مشاهده خریدها' } },
    { name: 'OrderCreate', path: '/orders/add', component: OrderCreate, meta: { auth: true, label: 'ساخت خریدها' } },
    { name: 'OrderShow', path: '/orders/show/:id', component: OrderShow, meta: { auth: true, label: 'مشاهده خرید' } }
  ]
}
