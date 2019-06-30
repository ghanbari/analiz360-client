const EmailMessageList = () => import('../components/emailMessage/List')
const EmailMessageCreate = () => import('../components/emailMessage/Create')
const EmailMessageUpdate = () => import('../components/emailMessage/Update')
const EmailMessageShow = () => import('../components/emailMessage/Show')

export default {
  name: 'EmailMessage',
  path: '/email_messages',
  meta: { auth: true, label: 'مدیریت ایمیل' },
  component: {
    render (c) {
      return c('router-view')
    }
  },
  children: [
    { name: 'EmailMessageList', path: '/email_messages/list', component: EmailMessageList, meta: { auth: true, label: 'مشاهده ایمیل ها' } },
    { name: 'EmailMessageCreate', path: '/email_messages/create', component: EmailMessageCreate, meta: { auth: true, label: 'ارسال ایمیل' } },
    { name: 'EmailMessageUpdate', path: '/email_messages/edit/:id', component: EmailMessageUpdate, meta: { auth: true, label: 'ویرایش ایمیل' } },
    { name: 'EmailMessageShow', path: '/email_messages/show/:id', component: EmailMessageShow, meta: { auth: true, label: 'مشاهده ایمیل' } }
  ]
}
