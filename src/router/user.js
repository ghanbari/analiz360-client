const UserList = () => import('../components/user/List')
const UserCreate = () => import('../components/user/Create')
const UserUpdate = () => import('../components/user/Update')
const ChangePassword = () => import('../views/profile/ChangePassword')
const ChangeEmail = () => import('../components/user/profile/ChangeEmail')
const UserShow = () => import('../components/user/Show')
const UserUpdateProfile = () => import('../views/profile/UserProfile')

export default {
  name: 'Users',
  path: '/users',
  meta: { auth: true, label: 'کاربران', role: 'ROLE_ADMIN' },
  component: {
    render (c) {
      return c('router-view')
    }
  },
  children: [
    { name: 'UserList', path: '/users/list', component: UserList, meta: { auth: true, label: 'مشاهده کاربران' } },
    { name: 'UserCreate', path: '/users/create', component: UserCreate, meta: { auth: true, label: 'افزودن کاربر' } },
    { name: 'UserUpdate', path: '/users/edit/:id', component: UserUpdate, meta: { auth: true, label: 'ویرایش کاربر' } },
    { name: 'UserPasswordUpdate', path: '/users/password/change', component: ChangePassword, meta: { auth: true, label: 'ویرایش رمزعبور' } },
    { name: 'UserEmailVerify', path: '/users/email/verify', component: ChangeEmail, meta: { auth: true, label: 'ویرایش ایمیل' } },
    { name: 'UserShow', path: '/users/show/:id', component: UserShow, meta: { auth: true, label: 'پروفایل', title: 'مشاهده پروفایل کاربر' } },
    { name: 'UserUpdateProfile', path: '/users/profile/edit', component: UserUpdateProfile, meta: { auth: true, label: 'پروفایل', title: 'ویرایش پروفایل' } }
  ]
}
