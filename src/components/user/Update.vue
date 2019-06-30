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
            v-if="item"
            :handle-submit="onSendForm"
            :handle-update-field="updateField"
            :values="item"
            :violations="violations"
            :initial-values="userRetrieved"
          />
        </b-card>
      </b-col>
    </b-row>
  </d-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import UserForm from './Form.vue'

export default {
  components: {
    UserForm
  },

  data () {
    return {
      item: {}
    }
  },

  computed: {
    ...mapGetters({
      userUpdateLoading: 'user/update/isLoading',
      userUpdateError: 'user/update/error',
      userUpdateViolations: 'user/update/violations',
      userRetrieved: 'user/update/retrieved',
      userUpdated: 'user/update/updated'
    }),

    violations () {
      return Object.assign({}, this.userUpdateViolations)
    }
  },

  watch: {
    userUpdated (updated) {
      if (updated) {
        this.$toasted.success('کاربر با موفقیت بروزرسانی شد.', { icon: 'icon-user' })
        this.$router.push({ name: 'UserList' })
      }
    },

    userUpdateError (val) {
      if (val) {
        this.$toasted.error(val, { icon: 'icon-attention' })
      }
    }
  },

  beforeDestroy () {
    this.reset()
  },

  created () {
    this.userRetrieve(decodeURIComponent(this.$route.params.id))
  },

  methods: {
    ...mapActions({
      userRetrieve: 'user/update/retrieve',
      update: 'user/update/update',
      updateUserRetrieved: 'user/update/updateRetrieved',
      updateReset: 'user/update/reset'
    }),

    reset () {
      this.updateReset()
      this.$toasted.clear()
    },

    onSendForm () {
      this.update()
    },

    updateField (field, value) {
      this.updateUserRetrieved({ [field]: value })
    }
  }
}
</script>
