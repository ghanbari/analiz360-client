const SmsMessageList = () => import('../components/smsMessage/List')
const SmsMessageCreate = () => import('../components/smsMessage/Create')
const SmsMessageUpdate = () => import('../components/smsMessage/Update')
const SmsMessageShow = () => import('../components/smsMessage/Show')

export default {
  name: 'SmsMessage',
  path: '/sms_messages',
  meta: { auth: true, label: 'مدیریت پیامک' },
  component: {
    render (c) {
      return c('router-view')
    }
  },
  children: [
    { name: 'SmsMessageList', path: '/sms_messages/list', component: SmsMessageList, meta: { auth: true, label: 'مشاهده پیامک ها' } },
    { name: 'SmsMessageCreate', path: '/sms_messages/create', component: SmsMessageCreate, meta: { auth: true, label: 'ارسال پیامک', title: 'ارسال پیامک' } },
    { name: 'SmsMessageUpdate', path: '/sms_messages/edit/:id', component: SmsMessageUpdate, meta: { auth: true, label: 'بروزرسانی پیامک' } },
    { name: 'SmsMessageShow', path: '/sms_messages/show/:id', component: SmsMessageShow, meta: { auth: true, label: 'مشاهده پیامک', title: 'مشاهده پیامک' } }
  ]
}
