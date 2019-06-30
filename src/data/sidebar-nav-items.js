import { store } from '../store'

const hasRole = store.getters['user/profile/hasRole']

const items = [{
  title: 'داشبورد',
  to: {
    name: 'Dashboard'
  },
  htmlBefore: '<i class="icon-gauge-1"></i>',
  htmlAfter: ''
}, {
  title: 'مدیریت کاربران',
  htmlBefore: '<i class="icon-users"></i>',
  roles: ['ROLE_ADMIN'],
  to: {
    name: 'Users'
  },
  items: [{
    title: 'افزودن کاربر',
    htmlBefore: '<i class="icon-user-add"></i>',
    roles: ['ROLE_ADMIN'],
    to: {
      name: 'UserCreate'
    }
  }, {
    title: 'مشاهده کاربران',
    htmlBefore: '<i class="icon-users"></i>',
    roles: ['ROLE_ADMIN'],
    to: {
      name: 'UserList'
    }
  }]
}, {
  title: 'مدیریت دامنه ها',
  htmlBefore: '<i class="icon-globe"></i>',
  roles: ['ROLE_ADMIN'],
  to: {
    name: 'Domains'
  },
  items: [{
    title: 'افزودن دامنه',
    htmlBefore: '<i class="icon-list-add"></i>',
    roles: ['ROLE_ADMIN'],
    to: {
      name: 'DomainCreate'
    }
  }, {
    title: 'مشاهده دامنه ها',
    htmlBefore: '<i class="icon-list"></i>',
    roles: ['ROLE_ADMIN'],
    to: {
      name: 'DomainList'
    }
  }]
}, {
  title: 'مدیریت محصولات',
  htmlBefore: '<i class="icon-shopping-bag"></i>',
  roles: ['ROLE_ADMIN'],
  to: {
    name: 'Products'
  },
  items: [{
    title: 'افزودن محصول',
    htmlBefore: '<i class="icon-list-add"></i>',
    roles: ['ROLE_ADMIN'],
    to: {
      name: 'ProductCreate'
    }
  }, {
    title: 'مشاهده محصولات',
    htmlBefore: '<i class="icon-list"></i>',
    roles: ['ROLE_ADMIN'],
    to: {
      name: 'ProductList'
    }
  }]
}, {
  title: 'مدیریت پیامک',
  htmlBefore: '<i class="icon-comment-alt"></i>',
  roles: ['ROLE_ADMIN'],
  to: {
    name: 'SmsMessage'
  },
  items: [{
    title: 'ارسال پیام',
    htmlBefore: '<i class="icon-list-add"></i>',
    roles: ['ROLE_ADMIN'],
    to: {
      name: 'SmsMessageCreate'
    }
  }, {
    title: 'مشاهده پیام ها',
    htmlBefore: '<i class="icon-list"></i>',
    roles: ['ROLE_ADMIN'],
    to: {
      name: 'SmsMessageList'
    }
  }]
}, {
  title: 'مدیریت ایمیل',
  htmlBefore: '<i class="icon-mail"></i>',
  roles: ['ROLE_ADMIN'],
  to: {
    name: 'Products'
  },
  items: [{
    title: 'ساخت قالب',
    htmlBefore: '<i class="icon-file-code"></i>',
    roles: ['ROLE_ADMIN'],
    to: {
      name: 'EmailTemplateCreate'
    }
  }, {
    title: 'مشاهده قالب ها',
    htmlBefore: '<i class="icon-list"></i>',
    roles: ['ROLE_ADMIN'],
    to: {
      name: 'EmailTemplateList'
    }
  }, {
    title: 'ارسال ایمیل',
    htmlBefore: '<i class="icon-mail"></i>',
    roles: ['ROLE_ADMIN'],
    to: {
      name: 'EmailMessageCreate'
    }
  }, {
    title: 'مشاهده ایمیل ها',
    htmlBefore: '<i class="icon-list"></i>',
    roles: ['ROLE_ADMIN'],
    to: {
      name: 'EmailMessageList'
    }
  }]
}, {
  title: 'پیام های زماندار',
  htmlBefore: '<i class="icon-calendar"></i>',
  roles: ['ROLE_ADMIN'],
  to: {
    name: 'ScheduledMessage'
  },
  items: [{
    title: 'تعریف الگو',
    htmlBefore: '<i class="icon-list-add"></i>',
    roles: ['ROLE_ADMIN'],
    to: {
      name: 'ScheduledMessageCreate'
    }
  }, {
    title: 'مشاهده الگوها',
    htmlBefore: '<i class="icon-list"></i>',
    roles: ['ROLE_ADMIN'],
    to: {
      name: 'ScheduledMessageList'
    }
  }]
}]

const createList = (list, items) => {
  items.forEach((item) => {
    const listItem = item

    if (listItem.hasOwnProperty('roles')) {
      if (hasRole(listItem.roles)) {
        list.push(listItem)
      }
    } else {
      list.push(listItem)
    }

    if (item.hasOwnProperty('items')) {
      const children = []
      createList(children, item.items)
      listItem.items = children
    }
  })
}

export default function () {
  const list = []
  createList(list, items)
  return list
}
