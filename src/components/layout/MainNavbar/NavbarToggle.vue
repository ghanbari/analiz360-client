<template>
  <nav class="nav">
    <a
      href="#"
      class="nav-link nav-link-icon toggle-sidebar d-md-inline d-lg-none text-center my-auto"
      @click="handleClick()"
    >
      <menu-icon />
    </a>
  </nav>
</template>

<script>
import MenuIcon from "vue-material-design-icons/Menu.vue"

export default {
  name: 'NavbarToggle',
  components: {
    MenuIcon,
  },
  methods: {
    handleClick () {
      this.$eventHub.$emit('toggle-sidebar')
    }
  }
}
</script>
