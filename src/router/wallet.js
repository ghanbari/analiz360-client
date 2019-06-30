const WalletList = () => import('../components/wallet/List')
const WalletShow = () => import('../components/wallet/Show')

export default {
  path: 'wallets',
  meta: { auth: true, label: 'کیف پول' },
  component: {
    render (c) {
      return c('router-view')
    }
  },
  children: [
    { name: 'WalletList', path: '/wallets/', component: WalletList, meta: { auth: true, label: 'مشاهده تراکنش ها' } },
    { name: 'WalletShow', path: '/wallets/show/:id', component: WalletShow, meta: { auth: true, label: 'مشاهده تراکنش' } }
  ]
}
