<template>
  <div>
    <h1>Show {{ item && item['@id'] }}</h1>

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
            <td>template</td>
            <td>{{ item['template'] }}</td>
          </tr>
          <tr>
            <td>arguments</td>
            <td>{{ item['arguments'] }}</td>
          </tr>
          <tr>
            <td>time</td>
            <td>{{ item['time'] }}</td>
          </tr>
          <tr>
            <td>receptor</td>
            <td>{{ item['receptor'] }}</td>
          </tr>
          <tr>
            <td>priority</td>
            <td>{{ item['priority'] }}</td>
          </tr>
          <tr>
            <td>senderEmail</td>
            <td>{{ item['senderEmail'] }}</td>
          </tr>
          <tr>
            <td>status</td>
            <td>{{ item['status'] }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <router-link
      v-if="item"
      :to="{ name: 'EmailMessageList' }"
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
    deleteError: 'emailMessage/del/error',
    error: 'emailMessage/show/error',
    isLoading: 'emailMessage/show/isLoading',
    item: 'emailMessage/show/retrieved'
  }),

  beforeDestroy () {
    this.reset()
  },

  created () {
    this.retrieve(decodeURIComponent(this.$route.params.id))
  },

  methods: {
    ...mapActions({
      del: 'emailMessage/del/del',
      reset: 'emailMessage/show/reset',
      retrieve: 'emailMessage/show/retrieve'
    }),

    deleteItem (item) {
      if (window.confirm('Are you sure you want to delete this item?')) {
        this.del(item).then(() => this.$router.push({ name: 'EmailMessageList' }))
      }
    }
  }
}
</script>
