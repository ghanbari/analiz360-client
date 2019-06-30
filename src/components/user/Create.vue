<template>
  <d-container
    fluid
    class="main-content-container px-4 py-5"
  >
    <b-row>
      <b-col md="12">
        <b-card>
          <b-card-title><span class="icon-wpforms" /> اطلاعات کاربر</b-card-title>
          <b-card-sub-title>&nbsp;</b-card-sub-title>

          <UserForm
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
import UserForm from './Form'

const userMap = createNamespacedHelpers('user/create')

export default {
  components: {
    UserForm
  },

  data () {
    return {
      item: {
        sex: 'm',
        status: 1
      }
    }
  },

  computed: {
    ...userMap.mapGetters({
      userCreateError: 'error',
      userCreateLoading: 'isLoading',
      userCreated: 'created',
      userCreateViolations: 'violations'
    }),

    violations () {
      return Object.assign({}, this.userCreateViolations)
    }
  },

  watch: {
    userCreated (userCreated) {
      if (userCreated) {
        this.$toasted.success('کاربر با موفقیت ساخته شد.', { icon: 'icon-user' })
        this.$router.push({ name: 'UserList' })
      }
    },

    userCreateError (val) {
      if (val) {
        this.$toasted.error(val, { icon: 'icon-attention' })
      }
    }
  },

  beforeDestroy () {
    this.reset()
  },

  methods: {
    ...userMap.mapActions({
      userCreate: 'create',
      userReset: 'reset'
    }),

    reset () {
      this.userReset()
      this.$toasted.clear()
    },

    updateField (field, value) {
      Object.assign(this.item, { [field]: value })
    },

    onSendForm () {
      this.userCreate(this.item)
    }
  }
}
</script>
