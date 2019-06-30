<template>
  <div>
    <h1>Show {{ item && item['@id'] }}</h1>

    <div
      v-if="isLoading"
      class="alert alert-info"
      role="status"
    >
      Loading...
    </div>
    <div
      v-if="error"
      class="alert alert-danger"
      role="alert"
    >
      <span
        class="fa fa-exclamation-triangle"
        aria-hidden="true"
      /> {{ error }}
    </div>
    <div
      v-if="deleteError"
      class="alert alert-danger"
      role="alert"
    >
      <span
        class="fa fa-exclamation-triangle"
        aria-hidden="true"
      /> {{ deleteError }}
    </div>
    <div
      v-if="item"
      class="table-responsive"
    >
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>user</td>
            <td>{{ item['user'] }}</td>
          </tr>
          <tr>
            <td>product</td>
            <td>{{ item['product'] }}</td>
          </tr>
          <tr>
            <td>info</td>
            <td>{{ item['info'] }}</td>
          </tr>
          <tr>
            <td>voucher</td>
            <td>{{ item['voucher'] }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <router-link
      v-if="item"
      :to="{ name: 'OrderList' }"
      class="btn btn-default"
    >
      Back to list
    </router-link>
    <button
      class="btn btn-danger"
      @click="deleteItem(item)"
    >
      Delete
    </button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  computed: mapGetters({
    deleteError: 'order/del/error',
    error: 'order/show/error',
    isLoading: 'order/show/isLoading',
    item: 'order/show/retrieved'
  }),

  beforeDestroy () {
    this.reset()
  },

  created () {
    this.retrieve(decodeURIComponent(this.$route.params.id))
  },

  methods: {
    ...mapActions({
      del: 'order/del/del',
      reset: 'order/show/reset',
      retrieve: 'order/show/retrieve'
    }),

    deleteItem (item) {
      if (window.confirm('Are you sure you want to delete this item?')) {
        this.del(item).then(() => this.$router.push({ name: 'OrderList' }))
      }
    }
  }
}
</script>
