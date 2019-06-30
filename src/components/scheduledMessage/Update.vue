<template>
  <d-container
    fluid
    class="main-content-container px-4 py-5"
  >
    <b-row>
      <b-col md="12">
        <b-card
          title="<span class=&quot;fa fa-envelope&quot;></span> ویرایش پیام زماندار"
          sub-title="&nbsp"
        >
          <ScheduledMessageForm
            v-if="item"
            :handle-submit="onSendForm"
            :violations="violations"
            :values="item"
            :delete-message="del"
          />
        </b-card>
      </b-col>
    </b-row>
  </d-container>
</template>>

<script>
import { mapActions, mapGetters } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import debounce from 'lodash/debounce'
import ScheduledMessageForm from './Form.vue'

export default {
  components: {
    ScheduledMessageForm
  },

  data () {
    return {
      item: null
    }
  },

  computed: {
    ...mapGetters({
      messageUpdateLoading: 'scheduledMessage/update/isLoading',
      messageUpdateError: 'scheduledMessage/update/error',
      messageRetrieved: 'scheduledMessage/update/retrieved',
      messageUpdated: 'scheduledMessage/update/updated',
      messageViolations: 'scheduledMessage/update/violations',
      messageDeleteError: 'scheduledMessage/del/error',
      messageDeleteLoading: 'scheduledMessage/del/isLoading',
      messageDeleted: 'scheduledMessage/del/deleted'
    }),

    violations () {
      return Object.assign({}, this.messageViolations)
    }
  },

  watch: {
    messageUpdated (messageUpdated) {
      if (messageUpdated) {
        this.$toasted.success('الگو با موفقیت بروزرسانی شد.', { icon: 'icon-calendar' })
        this.$router.push({ name: 'ScheduledMessageList' })
      }
    },

    messageDeleted (messageDeleted) {
      if (messageDeleted) {
        this.$toasted.success('الگو با موفقیت حذف شد.', { icon: 'icon-attention-alt' })
        this.$router.push({ name: 'ScheduledMessageList' })
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
    },

    messageRetrieved (val) {
      if (this.item === null) {
        this.item = cloneDeep(this.messageRetrieved)
      }
    },

    item: {
      handler: debounce(function (item) {
        this.messageUpdateRetrieved(cloneDeep(item))
      }, 500),
      deep: true
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
      messageDelete: 'scheduledMessage/del/del',
      messageDeleteReset: 'scheduledMessage/del/reset',
      messageRetrieve: 'scheduledMessage/update/retrieve',
      messageUpdateReset: 'scheduledMessage/update/reset',
      messageUpdate: 'scheduledMessage/update/update',
      messageUpdateRetrieved: 'scheduledMessage/update/updateRetrieved'
    }),

    del () {
      if (window.confirm('این الگو پاک شود؟')) {
        this.messageDelete(this.messageRetrieved)
      }
    },

    reset () {
      this.messageUpdateReset()
      this.messageDeleteReset()
    },

    onSendForm () {
      if (!this.messageRetrieved.all) {
        if (this.messageRetrieved.receptors.length === 0 && this.messageRetrieved.users.length === 0) {
          this.$toasted.error('لطفا گیرنده را مشخص نمایید', { icon: 'icon-attention' })
          return
        }
      } else {
        this.item.receptors = []
        this.item.users = []
      }

      this.messageUpdate()
    }
  }
}
</script>
