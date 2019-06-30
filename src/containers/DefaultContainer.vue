<template>
  <div class="app">
    <AppHeader fixed>
      <SidebarToggler
        v-if="$user && $user.hasOwnProperty('roles') && $user.roles.indexOf('ROLE_ADMIN') !== -1"
        class="d-lg-none"
        display="md"
        mobile
      />
      <b-link
        class="navbar-brand"
        to="#"
      >
        <img
          class="navbar-brand-full"
          src="images/logo/logo_sm.png"
          width="40"
          height="40"
        >
      </b-link>
      <SidebarToggler
        v-if="$user && $user.hasOwnProperty('roles') && $user.roles.indexOf('ROLE_ADMIN') !== -1"
        class="d-md-down-none"
        display="lg"
      />
      <b-navbar-nav class="d-md-down-none">
        <b-nav-item
          class="px-3"
          to="/domains/create"
        >
          افزودن دامنه
        </b-nav-item>
        <b-nav-item
          class="px-3"
          to="/domain_watchers"
        >
          دامنه ها
        </b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="mr-auto text-right">
        <!--        <b-nav-item class="d-md-down-none">-->
        <!--          <i class="icon-bell"></i>-->
        <!--          <b-badge pill variant="danger">5</b-badge>-->
        <!--        </b-nav-item>-->
        <!--        <b-nav-item class="d-md-down-none">-->
        <!--          <i class="icon-list"></i>-->
        <!--        </b-nav-item>-->
        <!--        <b-nav-item class="d-md-down-none">-->
        <!--          <i class="icon-location-pin"></i>-->
        <!--        </b-nav-item>-->
      </b-navbar-nav>
      <b-navbar-nav class="mr-auto text-right pl-2">
        <Search />
        <DefaultHeaderDropdownAccnt />
      </b-navbar-nav>
      <!--<AsideToggler class="d-none d-lg-block" />-->
      <!--<AsideToggler class="d-lg-none" mobile />-->
    </AppHeader>
    <div class="app-body">
      <AppSidebar :hidden="!$user || !$user.hasOwnProperty('roles') || $user.roles.indexOf('ROLE_ADMIN') === -1">
        <SidebarHeader />
        <SidebarForm />
        <SidebarNav :nav-items="nav" />
        <SidebarFooter />
        <SidebarMinimizer />
      </AppSidebar>
      <main class="main">
        <Breadcrumb :list="list" />
        <div class="container-fluid">
          <router-view />
        </div>
      </main>
      <!--      <AppAside fixed>-->
      <!--aside-->
      <!--<DefaultAside/>-->
      <!--      </AppAside>-->
    </div>
    <!--<TheFooter>-->
    <!--&lt;!&ndash;footer&ndash;&gt;-->
    <!--<div>-->
    <!--<a href="https://coreui.io">CoreUI</a>-->
    <!--<span class="ml-1">&copy; 2018 creativeLabs.</span>-->
    <!--</div>-->
    <!--<div class="ml-auto">-->
    <!--<span class="mr-1">Powered by</span>-->
    <!--<a href="https://coreui.io">CoreUI for Vue</a>-->
    <!--</div>-->
    <!--</TheFooter>-->
  </div>
</template>

<script>
import nav from '@/_nav'
import {
  Header as AppHeader, SidebarToggler, Sidebar as AppSidebar, SidebarFooter, SidebarForm, SidebarHeader, SidebarMinimizer, SidebarNav, Breadcrumb
} from '@coreui/vue'
// import { Aside as AppAside, AsideToggler, Footer as TheFooter } from '@coreui/vue'
// import DefaultAside from './DefaultAside'
import DefaultHeaderDropdownAccnt from './DefaultHeaderDropdownAccnt'
import Search from './Search'

export default {
  name: 'DefaultContainer',
  components: {
    // AsideToggler,
    AppHeader,
    AppSidebar,
    // AppAside,
    // TheFooter,
    Breadcrumb,
    // DefaultAside,
    DefaultHeaderDropdownAccnt,
    SidebarForm,
    SidebarFooter,
    SidebarToggler,
    SidebarHeader,
    SidebarNav,
    SidebarMinimizer,
    Search
  },
  data () {
    return {
      nav: nav.items
    }
  },
  computed: {
    name () {
      return this.$route.name
    },
    list () {
      return this.$route.matched.filter(
        route => (route.meta.label || route.name) &&
                (!route.meta.hasOwnProperty('role') || !this.$user || !this.$user.hasOwnProperty('roles') || this.$user.roles.indexOf(route.meta.role) > -1)
      )
    }
  }
}
</script>
