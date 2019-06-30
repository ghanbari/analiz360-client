const ScheduledMessageList = () => import('../components/scheduledMessage/List')
const ScheduledMessageCreate = () => import('../components/scheduledMessage/Create')
const ScheduledMessageUpdate = () => import('../components/scheduledMessage/Update')
const ScheduledMessageShow = () => import('../components/scheduledMessage/Show')

export default {
  name: 'ScheduledMessage',
  path: '/scheduled_messages',
  meta: { auth: true, label: 'پیام های زماندار' },
  component: {
    render (c) {
      return c('router-view')
    }
  },
  children: [
    { name: 'ScheduledMessageList', path: '/scheduled_messages/list', component: ScheduledMessageList, meta: { auth: true, label: 'مشاهده الگوها' } },
    { name: 'ScheduledMessageCreate', path: '/scheduled_messages/create', component: ScheduledMessageCreate, meta: { auth: true, label: 'تعریف الگو' } },
    { name: 'ScheduledMessageUpdate', path: '/scheduled_messages/edit/:id', component: ScheduledMessageUpdate, meta: { auth: true, label: 'بروزرسانی الگو' } },
    { name: 'ScheduledMessageShow', path: '/scheduled_messages/show/:id', component: ScheduledMessageShow, meta: { auth: true, label: 'مشاهده الگو' } }
  ]
}
