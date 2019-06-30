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
            <td>price</td>
            <td>{{ item['price'] }}</td>
          </tr>
          <tr>
            <td>unit</td>
            <td>{{ item['unit'] }}</td>
          </tr>
          <tr>
            <td>type</td>
            <td>{{ item['type'] }}</td>
          </tr>
          <tr>
            <td>title</td>
            <td>{{ item['title'] }}</td>
          </tr>
          <tr>
            <td>image</td>
            <td>{{ item['image'] }}</td>
          </tr>
          <tr>
            <td>service</td>
            <td>{{ item['service'] }}</td>
          </tr>
          <tr>
            <td>active</td>
            <td>{{ item['active'] }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <router-link
      v-if="item"
      :to="{ name: 'ProductList' }"
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
    deleteError: 'product/del/error',
    error: 'product/show/error',
    isLoading: 'product/show/isLoading',
    item: 'product/show/retrieved'
  }),

  beforeDestroy () {
    this.reset()
  },

  created () {
    this.retrieve(decodeURIComponent(this.$route.params.id))
  },

  methods: {
    ...mapActions({
      del: 'product/del/del',
      reset: 'product/show/reset',
      retrieve: 'product/show/retrieve'
    }),

    deleteItem (item) {
      if (window.confirm('Are you sure you want to delete this item?')) {
        this.del(item).then(() => this.$router.push({ name: 'ProductList' }))
      }
    }
  }
}
</script>
