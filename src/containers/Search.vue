<template>
  <div
    role="group"
    class="input-group mt-3"
  >
    <div class="input-group-append">
      <div class="input-group-text">
        <span class="icon-search" />
      </div>
    </div>
    <input
      ref="input"
      class="form-control"
      placeholder="دامنه را وارد نمایید"
      type="search"
      @keypress="searchOnEnter"
    >
  </div>
</template>

<script>
export default {
  name: 'Search',
  methods: {
    searchOnEnter (event) {
      if (event.keyCode === 13) {
        event.preventDefault() // Ensure it is only this code that rusn

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
