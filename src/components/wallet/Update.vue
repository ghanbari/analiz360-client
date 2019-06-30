<template>
  <div>
    <h1>Edit {{ item && item['@id'] }}</h1>

    <div
      v-if="created"
      class="alert alert-success"
      role="status"
    >
      {{ created['@id'] }} created.
    </div>
    <div
      v-if="updated"
      class="alert alert-success"
      role="status"
    >
      {{ updated['@id'] }} updated.
    </div>
    <div
      v-if="isLoading || deleteLoading"
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

    <WalletForm
      v-if="item"
      :handle-submit="onSendForm"
      :handle-update-field="updateField"
      :values="item"
      :errors="violations"
      :initial-values="retrieved"
    />

    <router-link
      v-if="item"
      :to="{ name: 'WalletList' }"
      class="btn btn-default"
    >
      Back to list
    </router-link>
    <button
      class="btn btn-danger"
      @click="del"
    >
      Delete
    </button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import WalletForm from './Form.vue'

export default {
  components: {
    WalletForm
  },

  data () {
    return {
      item: {}
    }
  },

  computed: {
    ...mapGetters({
      isLoading: 'wallet/update/isLoading',
      error: 'wallet/update/error',
      deleteError: 'wallet/del/error',
      deleteLoading: 'wallet/del/isLoading',
      created: 'wallet/create/created',
      deleted: 'wallet/del/deleted',
      retrieved: 'wallet/update/retrieved',
      updated: 'wallet/update/updated',
      violations: 'wallet/update/violations'
    })
  },

  watch: {
    // eslint-disable-next-line object-shorthand,func-names
    deleted: function (deleted) {
      if (!deleted) {
        return
      }

      this.$router.push({ name: 'WalletList' })
    }
  },

  beforeDestroy () {
    this.reset()
  },

  created () {
    this.retrieve(decodeURIComponent(this.$route.params.id))
  },

  methods: {
    ...mapActions({
      createReset: 'wallet/create/reset',
      deleteItem: 'wallet/del/del',
      delReset: 'wallet/del/reset',
      retrieve: 'wallet/update/retrieve',
      updateReset: 'wallet/update/reset',
      update: 'wallet/update/update',
      updateRetrieved: 'wallet/update/updateRetrieved'
    }),

    del () {
      if (window.confirm('Are you sure you want to delete this wallet ?')) {
        this.deleteItem(this.retrieved)
      }
    },

    reset () {
      this.updateReset()
      this.delReset()
      this.createReset()
    },

    onSendForm () {
      this.update()
    },

    updateField (field, value) {
      this.updateRetrieved({ [field]: value })
    }
  }
}
</script>
