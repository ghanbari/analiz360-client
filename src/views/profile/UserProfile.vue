<template>
  <d-container
    v-if="userRetrieved"
    fluid
    class="main-content-container px-4"
  >
    <!-- Content -->
    <d-row class="pt-5">
      <d-col lg="4">
        <user-details :user="userRetrieved" />
      </d-col>
      <d-col lg="8">
        <user-account-details
          :handle-submit="onSendForm"
          :handle-update-field="updateField"
          :values="item"
          :violations="violations"
          :initial-values="userRetrieved"
        />
        <change-email />
      </d-col>
    </d-row>
  </d-container>
</template>

<script>
import UserDetails from '@/components/user/profile/UserDetails.vue'
import UserAccountDetails from '@/components/user/profile/UserAccountDetails.vue'
import ChangeEmail from '../../components/user/profile/ChangeEmail'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'UserProfile',
  components: {
    UserDetails,
    UserAccountDetails,
    ChangeEmail
  },

  data () {
    return {
      item: {}
    }
  },

  computed: {
    ...mapGetters({
      userUpdateLoading: 'user/update-profile/isLoading',
      userUpdateError: 'user/update-profile/error',
      userUpdateViolations: 'user/update-profile/violations',
      userRetrieved: 'user/update-profile/retrieved',
      userUpdated: 'user/update-profile/updated'
    }),

    violations () {
      return Object.assign({}, this.userUpdateViolations)
    }
  },

  watch: {
    userUpdated (updated) {
      if (updated) {
        this.$toasted.success('کاربر با موفقیت بروزرسانی شد.', { icon: 'icon-user' })
        this.$router.push({ name: 'Dashboard' })
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
    this.userRetrieve()
  },

  methods: {
    ...mapActions({
      userRetrieve: 'user/update-profile/retrieve',
      update: 'user/update-profile/update',
      updateUserRetrieved: 'user/update-profile/updateRetrieved',
      updateReset: 'user/update-profile/reset'
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
