<template>
  <keep-alive>
    <component :is="dashboard" />
  </keep-alive>
</template>

<script>
import AdminDashboard from './AdminDashboard'
import UserDashboard from './UserDashboard'

export default {
  name: 'Dashboard',
  computed: {
    dashboard () {
      return (this.$user.hasOwnProperty('roles') && this.$user.roles.indexOf('ROLE_ADMIN') > -1) ? AdminDashboard : UserDashboard
    }
  }
}
</script>
