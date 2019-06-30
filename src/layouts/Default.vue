<template>
  <d-container fluid>
    <d-row>
      <!-- Main Sidebar -->
      <main-sidebar :items="sidebarItems" />

      <d-col
        class="main-content offset-lg-2 offset-md-3 p-0"
        tag="main"
        lg="10"
        md="9"
        sm="12"
      >
        <!-- Main Navbar -->
        <main-navbar />

        <router-view />

        <!-- Main Footer -->
        <main-footer />
      </d-col>
    </d-row>
  </d-container>
</template>

<script>
import getSidebarItems from '@/data/sidebar-nav-items'

// Main layout components
import MainNavbar from '@/components/layout/MainNavbar/MainNavbar.vue'
import MainSidebar from '@/components/layout/MainSidebar/MainSidebar.vue'
import MainFooter from '@/components/layout/MainFooter/MainFooter.vue'

export default {
  name: 'Analytics',
  components: {
    MainNavbar,
    MainSidebar,
    MainFooter
  },
  data () {
    return {
      sidebarItems: getSidebarItems(),
      breadcrumbList () {
        return this.$route.matched.filter(
          route => (route.meta.label || route.name) &&
                  (!route.meta.hasOwnProperty('role') || !this.$user || !this.$user.hasOwnProperty('roles') || this.$user.roles.indexOf(route.meta.role) > -1)
        )
      }
    }
  }
}
</script>
