<template>
  <d-container
    fluid
    class="main-content-container px-4 py-5"
  >
    <b-row>
      <b-col md="12">
        <b-card
          title="<span class=&quot;fa fa-envelope&quot;></span> ویرایش ایمیل"
          sub-title="&nbsp"
        >
          <EmailMessageForm
            v-if="item"
            :handle-submit="onSendForm"
            :handle-update-field="updateField"
            :values="item"
            :violations="violations"
            :delete-message="del"
            :initial-values="messageRetrieved"
          />
        </b-card>
      </b-col>
    </b-row>
  </d-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import EmailMessageForm from './Form.vue'

export default {
  components: {
    EmailMessageForm
  },

  data () {
    return {
      item: {}
    }
  },

  computed: {
    ...mapGetters({
      messageUpdateLoading: 'emailMessage/update/isLoading',
      messageUpdateError: 'emailMessage/update/error',
      messageRetrieved: 'emailMessage/update/retrieved',
      messageUpdated: 'emailMessage/update/updated',
      messageViolations: 'emailMessage/update/violations',
      messageDeleteError: 'emailMessage/del/error',
      messageDeleteLoading: 'emailMessage/del/isLoading',
      messageDeleted: 'emailMessage/del/deleted'
    }),

    violations () {
      return Object.assign({}, this.messageViolations)
    }
  },

  watch: {
    messageUpdated (messageUpdated) {
      if (messageUpdated) {
        this.$toasted.success('پیام با موفقیت بروزرسانی شد.', { icon: 'icon-mail' })
        this.$router.push({ name: 'EmailMessageList' })
      }
    },

    messageDeleted (messageDeleted) {
      if (messageDeleted) {
        this.$toasted.success('پیام با موفقیت حذف شد.', { icon: 'icon-attention-alt' })
        this.$router.push({ name: 'EmailMessageList' })
      }
    },

    messageUpdateError (val) {
      if (val) {
        this.$toasted.error(val, { icon: 'icon-attention' })
      }
    },

    messageDeleteError (val) {
      if (val) {
        this.$toasted.error(val, { icon: 'icon-attention' })
      }
    }
  },

  beforeDestroy () {
    this.reset()
  },

  created () {
    this.messageRetrieve(decodeURIComponent(this.$route.params.id))
  },

  methods: {
    ...mapActions({
      messageDelete: 'emailMessage/del/del',
      messageDeleteReset: 'emailMessage/del/reset',
      messageRetrieve: 'emailMessage/update/retrieve',
      messageUpdateReset: 'emailMessage/update/reset',
      messageUpdate: 'emailMessage/update/update',
      messageUpdateRetrieved: 'emailMessage/update/updateRetrieved'
    }),

    del () {
      if (window.confirm('آیا از حذف این پیام مطمین هستید؟')) {
        this.messageDelete(this.messageRetrieved)
      }
    },

    reset () {
      this.messageUpdateReset()
      this.messageDeleteReset()
      this.$toasted.clear()
    },

    onSendForm () {
      this.messageUpdate()
    },

    updateField (field, value) {
      this.messageUpdateRetrieved({ [field]: value })
    }
  }
}
</script>
