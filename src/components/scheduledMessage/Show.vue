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
            <td>message</td>
            <td>{{ item['message'] }}</td>
          </tr>
          <tr>
            <td>maxUsageCount</td>
            <td>{{ item['maxUsageCount'] }}</td>
          </tr>
          <tr>
            <td>usageCount</td>
            <td>{{ item['usageCount'] }}</td>
          </tr>
          <tr>
            <td>expireAt</td>
            <td>{{ item['expireAt'] }}</td>
          </tr>
          <tr>
            <td>expired</td>
            <td>{{ item['expired'] }}</td>
          </tr>
          <tr>
            <td>dateType</td>
            <td>{{ item['dateType'] }}</td>
          </tr>
          <tr>
            <td>date</td>
            <td>{{ item['date'] }}</td>
          </tr>
          <tr>
            <td>users</td>
            <td>{{ item['users'] }}</td>
          </tr>
          <tr>
            <td>receptors</td>
            <td>{{ item['receptors'] }}</td>
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
            <td>messageType</td>
            <td>{{ item['messageType'] }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <router-link
      v-if="item"
      :to="{ name: 'ScheduledMessageList' }"
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
    deleteError: 'scheduledMessage/del/error',
    error: 'scheduledMessage/show/error',
    isLoading: 'scheduledMessage/show/isLoading',
    item: 'scheduledMessage/show/retrieved'
  }),

  beforeDestroy () {
    this.reset()
  },

  created () {
    this.retrieve(decodeURIComponent(this.$route.params.id))
  },

  methods: {
    ...mapActions({
      del: 'scheduledMessage/del/del',
      reset: 'scheduledMessage/show/reset',
      retrieve: 'scheduledMessage/show/retrieve'
    }),

    deleteItem (item) {
      if (window.confirm('Are you sure you want to delete this item?')) {
        this.del(item).then(() => this.$router.push({ name: 'ScheduledMessageList' }))
      }
    }
  }
}
</script>
