const ShopProducts = () => import('../components/product/shop/List')
const ProductList = () => import('../components/product/List')
const ProductCreate = () => import('../components/product/Create')
const ProductUpdate = () => import('../components/product/Update')
const ProductShow = () => import('../components/product/Show')

export default {
  name: 'Products',
  path: '/products',
  meta: { auth: true, label: 'محصولات', role: 'ROLE_ADMIN' },
  component: {
    render (c) {
      return c('router-view')
    }
  },
  children: [
    { name: 'ShopProducts', path: '/shop/products/', component: ShopProducts, meta: { auth: true, label: 'مشاهده محصولات' } },
    { name: 'ProductList', path: '/products/List', component: ProductList, meta: { auth: true, label: 'مشاهده محصولات' } },
    { name: 'ProductCreate', path: '/products/create', component: ProductCreate, meta: { auth: true, label: 'افزودن محصول' } },
    { name: 'ProductUpdate', path: '/products/edit/:id', component: ProductUpdate, meta: { auth: true, label: 'ویرایش محصول' } },
    { name: 'ProductShow', path: '/products/show/:id', component: ProductShow, meta: { auth: true, label: 'مشاهده محصول' } }
  ]
}
