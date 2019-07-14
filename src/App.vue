<template>
  <div>
    <router-view />
    <vue-progress-bar />
  </div>
</template>

<script>
export default {
  name: 'App',

  created () {
    this.$router.beforeEach((to, from, next) => {
      if (to.meta.progress !== undefined) {
        const meta = to.meta.progress
        this.$Progress.parseMeta(meta)
      }

      if (to.meta.hasOwnProperty('showProgressBar') && to.meta.showProgressBar) {
        this.$Progress.start()
      }

      next()
    })

    this.$router.afterEach((to, from) => {
      if (from.meta.hasOwnProperty('showProgressBar') && from.meta.showProgressBar) {
        this.$Progress.finish()
      }
    })
  },

  metaInfo () {
    return {
      title: this.$route.meta.title || this.$route.meta.label,
      titleTemplate: `%s | ${this.$config.has('title') ? this.$config.get('title') : ''}`
    }
  }
}
</script>

<style lang="scss">
    /* Import Flag Icons Set */
    /*@import '~flag-icon-css/css/flag-icon.min.css';*/

    /* fix an problem in "node_modules/shards-ui/src/scss/_variables.scss" */
    $popover-arrow-width: 16px !default;

    @import 'assets/scss/shards-dashboards';

    @import '~bootstrap/scss/bootstrap';

    /* Import Bootstrap Vue Styles */
    @import '~bootstrap-vue/src/index';

    @import '~bootstrap/scss/bootstrap-rtl';

    @import 'assets/scss/shards-dashboards';

    @import '~vue-material-design-icons/styles.css';
</style>
