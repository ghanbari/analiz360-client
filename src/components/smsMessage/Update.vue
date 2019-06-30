<template>
  <d-container
    fluid
    class="main-content-container px-4 py-5"
  >
    <b-row>
      <b-col md="12">
        <b-card
          title="<span class=&quot;fa fa-envelope&quot;></span> ویرایش پیام"
          sub-title="&nbsp"
        >
          <SmsMessageForm
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
import SmsMessageForm from './Form.vue'

export default {
  components: {
    SmsMessageForm
  },

  data () {
    return {
      item: {}
    }
  },

  computed: {
    ...mapGetters({
      messageUpdateLoading: 'smsMessage/update/isLoading',
      messageUpdateError: 'smsMessage/update/error',
      messageRetrieved: 'smsMessage/update/retrieved',
      messageUpdated: 'smsMessage/update/updated',
      messageViolations: 'smsMessage/update/violations',
      messageDeleteError: 'smsMessage/del/error',
      messageDeleteLoading: 'smsMessage/del/isLoading',
      messageDeleted: 'smsMessage/del/deleted'
    }),

    violations () {
      return Object.assign({}, this.messageViolations)
    }
  },

  watch: {
    messageUpdated (messageUpdated) {
      if (messageUpdated) {
        this.$toasted.success('پیام با موفقیت بروزرسانی شد.', { icon: 'icon-mail' })
        this.$router.push({ name: 'SmsMessageList' })
      }
    },

    messageDeleted (messageDeleted) {
      if (messageDeleted) {
        this.$toasted.success('پیام با موفقیت حذف شد.', { icon: 'icon-attention-alt' })
        this.$router.push({ name: 'SmsMessageList' })
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
      messageDelete: 'smsMessage/del/del',
      messageDeleteReset: 'smsMessage/del/reset',
      messageRetrieve: 'smsMessage/update/retrieve',
      messageUpdateReset: 'smsMessage/update/reset',
      messageUpdate: 'smsMessage/update/update',
      messageUpdateRetrieved: 'smsMessage/update/updateRetrieved'
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
