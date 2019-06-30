const EmailTemplateList = () => import('../components/emailTemplate/List')
const EmailTemplateCreate = () => import('../components/emailTemplate/Create')
const EmailTemplateUpdate = () => import('../components/emailTemplate/Update')
const EmailTemplateShow = () => import('../components/emailTemplate/Show')

export default {
  name: 'EmailTemplate',
  path: '/email_templates',
  meta: { auth: true, label: 'قالب ایمیل' },
  component: {
    render (c) {
      return c('router-view')
    }
  },
  children: [
    { name: 'EmailTemplateList', path: '/email_templates/list', component: EmailTemplateList, meta: { auth: true, label: 'مشاهده قالب ها' } },
    { name: 'EmailTemplateCreate', path: '/email_templates/create', component: EmailTemplateCreate, meta: { auth: true, label: 'ساخت قالب' } },
    { name: 'EmailTemplateUpdate', path: '/email_templates/edit/:id', component: EmailTemplateUpdate, meta: { auth: true, label: 'ویرایش قالب' } },
    { name: 'EmailTemplateShow', path: '/email_templates/show/:id', component: EmailTemplateShow, meta: { auth: true, label: 'مشاهده قالب' } }
  ]
}
