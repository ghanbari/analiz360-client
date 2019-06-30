<template>
  <d-container
    fluid
    class="main-content-container px-4 py-5"
  >
    <b-row>
      <b-col md="12">
        <b-card
          title="<span class=&quot;fa fa-envelope&quot;></span> ارسال ایمیل"
          sub-title="&nbsp"
        >
          <EmailMessageForm
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
import EmailMessageForm from './Form'

const { mapGetters, mapActions } = createNamespacedHelpers('emailMessage/create')

export default {
  components: {
    EmailMessageForm
  },

  data () {
    return {
      item: {
        arguments: {},
        all: false,
        template: ''
      }
    }
  },

  computed: {
    ...mapGetters({
      messageError: 'error',
      messageLoading: 'isLoading',
      messageCreated: 'created',
      messageViolations: 'violations'
    }),

    violations () {
      return Object.assign({}, this.messageViolations)
    }
  },

  watch: {
    messageCreated (messageCreated) {
      if (messageCreated) {
        this.$toasted.success('پیام با موفقیت ثبت شد.', { icon: 'icon-mail' })
        this.$router.push({ name: 'EmailMessageList' })
      }
    },

    messageError (val) {
      if (val) {
        this.$toasted.error(val, { icon: 'icon-attention' })
      }
    }
  },

  beforeDestroy () {
    this.reset()
  },

  methods: {
    ...mapActions({
      messageCreate: 'create',
      messageReset: 'reset'
    }),

    onSendForm () {
      if (!this.item.hasOwnProperty('receptors')) {
        this.item.receptors = []
      }

      if (!this.item.hasOwnProperty('users')) {
        this.item.users = []
      }

      if (!this.item.all) {
        if (this.item.hasOwnProperty('selectedUsers')) {
          this.item.selectedUsers.forEach((user) => {
            if (user.id && !this.item.users.includes(user.id)) {
              this.item.users.push(user.id)
            }
          })
        }

        if (this.item.receptors.length === 0 && this.item.users.length === 0) {
          this.$toasted.error('لطفا گیرنده را مشخص نمایید', { icon: 'icon-attention' })
          return
        }
      } else {
        this.item.receptors = []
        this.item.users = []
      }

      this.messageCreate(this.item)
    },

    updateField (field, value) {
      Object.assign(this.item, { [field]: value })
    },

    reset () {
      this.messageReset()
      this.$toasted.clear()
    }
  }
}
</script>
