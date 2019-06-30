<template>
  <d-container
    fluid
    class="main-content-container px-4 py-5"
  >
    <b-row>
      <b-col
        md="8"
        class="mx-auto"
      >
        <b-card>
          <b-card-title><span class="icon-wpforms" /> اطلاعات دامنه</b-card-title>
          <b-card-sub-title>&nbsp;</b-card-sub-title>

          <DomainForm
            :handle-submit="onSendForm"
            :handle-update-field="updateField"
            :values="item"
            :violations="violations"
          />
        </b-card>
      </b-col>
    </b-row>
  </d-container>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import DomainForm from './Form'

const domainMap = createNamespacedHelpers('domain/create')

export default {
  components: {
    DomainForm
  },

  data () {
    return {
      item: {
        status: 1
      }
    }
  },

  computed: {
    ...domainMap.mapGetters({
      domainCreateError: 'error',
      domainCreateLoading: 'isLoading',
      domainCreated: 'created',
      domainCreateViolations: 'violations'
    }),

    violations () {
      return Object.assign({}, this.domainCreateViolations)
    }
  },

  watch: {
    domainCreated (domainCreated) {
      if (domainCreated) {
        this.$toasted.success('دامنه با موفقیت ساخته شد.', { icon: 'icon-globe' })

        if (this.$user && this.user.hasOwnProperty('roles') && this.$user.roles.indexOf('ROLE_ADMIN') > -1) {
          this.$router.push({ name: 'DomainList' })
        } else {
          this.$router.push({ name: 'Dashboard' })
        }
      }
    },

    domainCreateError (val) {
      if (val) {
        this.$toasted.error(val, { icon: 'icon-attention' })
      }
    }
  },

  beforeDestroy () {
    this.reset()
  },

  methods: {
    ...domainMap.mapActions({
      domainCreate: 'create',
      domainReset: 'reset'
    }),

    reset () {
      this.domainReset()
      this.$toasted.clear()
    },

    updateField (field, value) {
      Object.assign(this.item, { [field]: value })
    },

    onSendForm () {
      this.domainCreate(this.item)
    }
  }
}
</script>
