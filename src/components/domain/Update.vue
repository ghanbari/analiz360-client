<template>
  <d-container
    fluid
    class="main-content-container px-4 py-5"
  >
    <b-row>
      <b-col md="12">
        <b-card>
          <b-card-title><span class="icon-wpforms" /> ویرایش دامنه</b-card-title>
          <b-card-sub-title>&nbsp;</b-card-sub-title>

          <DomainForm
            v-if="item"
            :handle-submit="onSendForm"
            :handle-update-field="updateField"
            :values="item"
            :violations="violations"
            :initial-values="domainRetrieved"
          />
        </b-card>
      </b-col>
    </b-row>
  </d-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import DomainForm from './Form.vue'

export default {
  components: {
    DomainForm
  },

  data () {
    return {
      item: {}
    }
  },

  computed: {
    ...mapGetters({
      domainUpdateLoading: 'domain/update/isLoading',
      domainUpdateError: 'domain/update/error',
      domainUpdateViolations: 'domain/update/violations',
      domainRetrieved: 'domain/update/retrieved',
      domainUpdated: 'domain/update/updated'
    }),

    violations () {
      return Object.assign({}, this.domainUpdateViolations)
    }
  },

  watch: {
    domainUpdated (updated) {
      if (updated) {
        this.$toasted.success('دامنه با موفقیت بروزرسانی شد.', { icon: 'icon-globe' })

        if (this.$user && this.$user.hasOwnProperty('roles') && this.$user.roles.indexOf('ROLE_ADMIN') > -1) {
          this.$router.push({ name: 'DomainList' })
        } else {
          this.$router.push({ name: 'Dashboard' })
        }
      }
    },

    domainUpdateError (val) {
      if (val) {
        this.$toasted.error(val, { icon: 'icon-attention' })
      }
    }
  },

  beforeDestroy () {
    this.reset()
  },

  created () {
    this.domainRetrieve(decodeURIComponent(this.$route.params.id))
  },

  methods: {
    ...mapActions({
      domainRetrieve: 'domain/update/retrieve',
      update: 'domain/update/update',
      updateDomainRetrieved: 'domain/update/updateRetrieved',
      updateReset: 'domain/update/reset'
    }),

    reset () {
      this.updateReset()
      this.$toasted.clear()
    },

    onSendForm () {
      this.update()
    },

    updateField (field, value) {
      this.updateDomainRetrieved({ [field]: value })
    }
  }
}
</script>
