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
            <td>time</td>
            <td>{{ item['time'] }}</td>
          </tr>
          <tr>
            <td>message</td>
            <td>{{ item['message'] }}</td>
          </tr>
          <tr>
            <td>receptor</td>
            <td>{{ item['receptor'] }}</td>
          </tr>
          <tr>
            <td>maxTryCount</td>
            <td>{{ item['maxTryCount'] }}</td>
          </tr>
          <tr>
            <td>timeout</td>
            <td>{{ item['timeout'] }}</td>
          </tr>
          <tr>
            <td>priority</td>
            <td>{{ item['priority'] }}</td>
          </tr>
          <tr>
            <td>provider</td>
            <td>{{ item['provider'] }}</td>
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
      :to="{ name: 'SmsMessageList' }"
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
    deleteError: 'smsMessage/del/error',
    error: 'smsMessage/show/error',
    isLoading: 'smsMessage/show/isLoading',
    item: 'smsMessage/show/retrieved'
  }),

  beforeDestroy () {
    this.reset()
  },

  created () {
    this.retrieve(decodeURIComponent(this.$route.params.id))
  },

  methods: {
    ...mapActions({
      del: 'smsMessage/del/del',
      reset: 'smsMessage/show/reset',
      retrieve: 'smsMessage/show/retrieve'
    }),

    deleteItem (item) {
      if (window.confirm('Are you sure you want to delete this item?')) {
        this.del(item).then(() => this.$router.push({ name: 'SmsMessageList' }))
      }
    }
  }
}
</script>
