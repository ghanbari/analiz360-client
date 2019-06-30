export default {
  install (Vue) {
    Vue.mixin({
      computed: {
        $user () {
          return this.$store.getters['user/profile/retrieved']
        }
      }
    })
  }
}
