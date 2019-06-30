<template>
  <d-container
    fluid
    class="main-content-container px-4 py-5"
  >
    <b-row>
      <b-col md="12">
        <b-card
          title="<span class=&quot;icon-wpforms&quot;></span> ویرایش قالب ایمیل"
          sub-title="&nbsp"
        >
          <EmailTemplateForm
            v-if="item"
            :handle-submit="onSendForm"
            :handle-update-field="updateField"
            :values="item"
            :violations="violations"
            :delete-message="del"
            :initial-values="templateRetrieved"
          />
        </b-card>
      </b-col>
    </b-row>
  </d-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import EmailTemplateForm from './Form.vue'

export default {
  components: {
    EmailTemplateForm
  },

  data () {
    return {
      item: {}
    }
  },

  computed: {
    ...mapGetters({
      templateUpdateLoading: 'emailTemplate/update/isLoading',
      templateUpdateError: 'emailTemplate/update/error',
      templateRetrieved: 'emailTemplate/update/retrieved',
      templateUpdated: 'emailTemplate/update/updated',
      templateViolations: 'emailTemplate/update/violations',
      templateDeleteError: 'emailTemplate/del/error',
      templateDeleteLoading: 'emailTemplate/del/isLoading',
      templateDeleted: 'emailTemplate/del/deleted'
    }),

    violations () {
      return Object.assign({}, this.messageViolations)
    }
  },

  watch: {
    templateUpdated (templateUpdated) {
      if (templateUpdated) {
        this.$toasted.success('الگو با موفقیت بروزرسانی شد.', { icon: 'icon-code' })
        this.$router.push({ name: 'EmailTemplateList' })
      }
    },

    templateDeleted (templateDeleted) {
      if (templateDeleted) {
        this.$toasted.success('الگو با موفقیت حذف شد.', { icon: 'icon-attention-alt' })
        this.$router.push({ name: 'EmailTemplateList' })
      }
    },

    templateUpdateError (val) {
      if (val) {
        this.$toasted.error(val, { icon: 'icon-attention' })
      }
    },

    templateDeleteError (val) {
      if (val) {
        this.$toasted.error(val, { icon: 'icon-attention' })
      }
    }
  },

  beforeDestroy () {
    this.reset()
  },

  created () {
    this.templateRetrieve(decodeURIComponent(this.$route.params.id))
  },

  methods: {
    ...mapActions({
      templateDelete: 'emailTemplate/del/del',
      templateDeleteReset: 'emailTemplate/del/reset',
      templateRetrieve: 'emailTemplate/update/retrieve',
      templateUpdateReset: 'emailTemplate/update/reset',
      templateUpdate: 'emailTemplate/update/update',
      templateUpdateRetrieved: 'emailTemplate/update/updateRetrieved'
    }),

    del () {
      if (window.confirm('آیا همچنان تمایل به حذف این قالب دارید؟')) {
        this.templateDelete(this.templateRetrieved)
      }
    },

    reset () {
      this.templateUpdateReset()
      this.templateDeleteReset()
    },

    onSendForm () {
      this.templateUpdate()
    },

    updateField (field, value) {
      this.templateUpdateRetrieved({ [field]: value })
    }
  }
}
</script>
