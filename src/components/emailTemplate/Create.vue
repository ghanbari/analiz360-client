<template>
  <d-container
    fluid
    class="main-content-container px-4 py-5"
  >
    <b-row>
      <b-col md="12">
        <b-card>
          <b-card-title><span class="icon-wpforms" /> ساخت قالب ایمیل</b-card-title>
          <b-card-sub-title>&nbsp;</b-card-sub-title>

          <EmailTemplateForm
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
import EmailTemplateForm from './Form'

const { mapGetters, mapActions } = createNamespacedHelpers('emailTemplate/create')

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
      templateError: 'error',
      templateLoading: 'isLoading',
      templateCreated: 'created',
      templateViolations: 'violations'
    }),

    violations () {
      return Object.assign({}, this.templateViolations)
    }
  },

  watch: {
    templateCreated (templateCreated) {
      if (templateCreated) {
        this.$toasted.success('الگو با موفقیت ثبت شد.', { icon: 'icon-code' })
        this.$router.push({ name: 'EmailTemplateList' })
      }
    },

    templateError (val) {
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
      templateCreate: 'create',
      templateReset: 'reset'
    }),

    onSendForm () {
      this.templateCreate(this.item)
    },

    updateField (field, value) {
      Object.assign(this.item, { [field]: value })
    },

    reset () {
      this.templateReset()
      this.$toasted.clear()
    }
  }
}
</script>
