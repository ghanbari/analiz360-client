<template>
  <div>
    <h1>New Wallet</h1>

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

    <WalletForm
      :handle-submit="onSendForm"
      :handle-update-field="updateField"
      :values="item"
      :errors="violations"
    />

    <router-link
      :to="{ name: 'WalletList' }"
      class="btn btn-default"
    >
      Back to list
    </router-link>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import WalletForm from './Form'

const { mapGetters, mapActions } = createNamespacedHelpers('wallet/create')

export default {
  components: {
    WalletForm
  },

  data () {
    return {
      item: {}
    }
  },

  computed: mapGetters([
    'error',
    'isLoading',
    'created',
    'violations'
  ]),

  watch: {
    // eslint-disable-next-line object-shorthand,func-names
    created: function (created) {
      if (!created) {
        return
      }

      this.$router.push({ name: 'WalletUpdate', params: { id: created['@id'] } })
    }
  },

  methods: {
    ...mapActions([
      'create'
    ]),

    onSendForm () {
      this.create(this.item)
    },

    updateField (field, value) {
      Object.assign(this.item, { [field]: value })
    }
  }
}
</script>
