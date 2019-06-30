<template>
  <aside :class="['main-sidebar', 'col-12', 'col-md-3', 'col-lg-2', 'px-0', sidebarVisible ? 'open' : '']">
    <div class="main-navbar">
      <nav class="navbar align-items-stretch navbar-light bg-white flex-md-nowrap border-bottom p-0">
        <router-link
          :to="{name: 'Dashboard'}"
          tag="a"
          class="navbar-brand w-100 mr-0"
          style="line-height: 25px;"
        >
          <div class="d-table m-auto">
            <img
              id="main-logo"
              class="d-inline-block align-top mr-1"
              style="max-width: 25px;"
              src="@/assets/images/logo/logo_sm.svg"
              alt="Shards Dashboard"
            >
            <span
              v-if="!hideLogoText"
              class="d-none d-md-inline ml-1"
            >Shards Dashboard</span>
          </div>
        </router-link>
        <a
          class="toggle-sidebar d-sm-inline d-md-none d-lg-none"
          @click="handleToggleSidebar()"
        >
          <menu-swap-icon />
        </a>
      </nav>
    </div>

    <form
      action="#"
      class="main-sidebar__search w-100 border-right d-sm-flex d-md-none d-lg-none"
    >
      <div class="input-group input-group-seamless ml-3">
        <div class="input-group-prepend">
          <div class="input-group-text">
            <i class="fas fa-search" />
          </div>
        </div>
        <input
          class="navbar-search form-control"
          type="text"
          placeholder="Search for something..."
          aria-label="Search"
        >
      </div>
    </form>

    <div class="nav-wrapper">
      <d-nav class="flex-column">
        <li
          v-for="(item, navItemIdx) in items"
          :key="navItemIdx"
          class="nav-item dropdown"
        >
          <d-link
            v-d-toggle="`snc-${navItemIdx}`"
            :class="['nav-link', item.items && item.items.length ? 'dropdown-toggle' : '']"
            :to="item.to"
          >
            <!-- eslint-disable vue/no-v-html -->
            <div
              v-if="item.htmlBefore"
              class="item-icon-wrapper"
              v-html="item.htmlBefore"
            />
            <!--eslint-enable-->
            <span v-if="item.title">{{ item.title }}</span>
            <!-- eslint-disable vue/no-v-html -->
            <div
              v-if="item.htmlAfter"
              class="item-icon-wrapper"
              v-html="item.htmlAfter"
            />
            <!--eslint-enable-->
          </d-link>
          <d-collapse
            v-if="item.items && item.items.length"
            :id="`snc-${navItemIdx}`"
            class="dropdown-menu dropdown-menu-small"
            accordion="sidebar-items-accordion"
          >
            <d-dropdown-item
              v-for="(subItem, subItemIdx) in item.items"
              :key="subItemIdx"
              :href="subItem.href"
              :to="subItem.to"
            >
              <!-- eslint-disable vue/no-v-html -->
              <div
                v-if="subItem.htmlBefore"
                class="item-icon-wrapper"
                v-html="subItem.htmlBefore"
              />
              <!--eslint-enable-->
              <span v-if="subItem.title">{{ subItem.title }}</span>
              <!-- eslint-disable vue/no-v-html -->
              <div
                v-if="subItem.htmlAfter"
                class="item-icon-wrapper"
                v-html="subItem.htmlAfter"
              />
              <!--eslint-enable-->
            </d-dropdown-item>
          </d-collapse>
        </li>
      </d-nav>
    </div>
  </aside>
</template>

<script>
import MenuSwapIcon from "vue-material-design-icons/MenuSwap"

export default {
  name: 'MainSidebar',
  components: {
    MenuSwapIcon,
  },
  props: {
    /**
      * Whether to hide the logo text, or not.
      */
    hideLogoText: {
      type: Boolean,
      default: false
    },
    /**
     * The menu items.
     */
    items: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      sidebarVisible: false
    }
  },
  created () {
    this.$eventHub.$on('toggle-sidebar', this.handleToggleSidebar)
  },
  beforeDestroy () {
    this.$eventHub.$off('toggle-sidebar')
  },
  methods: {
    handleToggleSidebar () {
      this.sidebarVisible = !this.sidebarVisible
    }
  }
}
</script>

<style lang="scss">
  .main-sidebar {
    .item-icon-wrapper {
      display: inline-block;
      font-size: large;
    }
    .dropdown-menu {
      display: block;
    }
  }
</style>
