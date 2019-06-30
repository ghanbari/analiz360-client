<template>
  <d-form class="main-navbar__search w-100 d-none d-md-flex d-lg-flex">
    <d-input-group
      class="ml-3"
      seamless
    >
      <d-input-group-text slot="prepend">
        <magnify-icon class="search">
          جست و جو
        </magnify-icon>
      </d-input-group-text>
      <input
        class="navbar-search form-control"
        placeholder="دامنه را وارد نمایید"
        type="search"
        @keypress="searchOnEnter"
      >
    </d-input-group>
  </d-form>
</template>

<script>
import MagnifyIcon from "vue-material-design-icons/Magnify.vue"

export default {
  name: 'Search',
  components: {
    MagnifyIcon,
  },
  methods: {
    searchOnEnter (event) {
      if (event.keyCode === 13) {
        event.preventDefault()

        if (!/[0-9a-zA-Z]{3,}\.[0-9a-zA-Z]{2,}/.test(event.target.value)) {
          this.$toasted.info('دامنه وارد شده صحیح نیست', { icon: 'icon-attention', className: 'bg-warning font-weight-bold' })
        } else {
          this.$toasted.clear()
          this.$router.push({ name: 'DomainShow', params: { domain: event.target.value } })
        }
      }
    }
  }
}
</script>

<style lang="scss">
    main {
        .main-navbar {
            .input-group {
                .input-group-prepend {
                    position: relative;
                    svg.search {
                        fill: #5a6169;
                    }
                }
            }
        }
    }
</style>
