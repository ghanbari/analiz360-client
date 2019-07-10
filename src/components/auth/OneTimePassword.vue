<template>
  <b-form
    v-if="!tokenCreationResult && registrationType"
    @submit.prevent="submit()"
  >
    <h1 class="d-none d-sm-block">کد امنیتی</h1>
    <h2 class="d-block d-sm-none text-center">کد امنیتی</h2>
    <p class="text-muted text-center text-sm-right">
      لطفا {{ registrationType === 'phone' ? 'شماره همراه' : 'ایمیل' }} خود را وارد نمایید
    </p>
    <b-input-group class="mb-3">
      <b-input-group-append>
        <b-input-group-text>
          <i
            v-if="registrationType === 'phone'"
            class="icon-phone"
          />
          <i
            v-if="registrationType === 'email'"
            class="icon-at"
          />
        </b-input-group-text>
      </b-input-group-append>
      <b-form-input
        v-validate="registrationType === 'phone' ? 'required|numeric|max:11|min:11' : 'required|email'"
        name="receptor"
        required="required"
        :placeholder="registrationType === 'phone' ? 'شماره همراه' : 'ایمیل'"
        :type="registrationType === 'phone' ? 'text' : 'email'"
        :data-vv-as="registrationType === 'phone' ? 'شماره همراه' : 'ایمیل'"
        :state="validateState('receptor')"
        :value="receptor"
        @input="$emit('update:receptor', $event)"
      />
      <b-form-invalid-feedback>
        {{ veeErrors.first('receptor') }}
      </b-form-invalid-feedback>
    </b-input-group>
    <b-row>
      <b-col cols="12">
        <b-button
          :disabled="tokenLoading || veeErrors.any()"
          type="submit"
          variant="success"
          class="active mt-1"
        >
          ارسال کد
        </b-button>
      </b-col>
    </b-row>
  </b-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'OneTimePassword',
  props: {
    receptor: {
      type: String,
      required: true
    },
    tokenCreationResult: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters({
      tokenError: 'oneTimePassword/error',
      tokenLoading: 'oneTimePassword/isLoading',
      tokenCreated: 'oneTimePassword/created',
      tokenTimer: 'oneTimePassword/timer'
    }),

    registrationType () {
      return this.$remoteConfig.get('registration.type', null)
    }
  },

  watch: {
    receptor (val, old) {
      const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g]
      const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g]

      for (let i = 0; i < 10; i++) {
        val = val.replace(persianNumbers[i], i).replace(arabicNumbers[i], i)
      }

      this.$emit('update:receptor', val)
    },

    tokenCreated (val) {
      this.$toasted.info(val, { icon: 'icon-user' })
      this.$emit('update:token-creation-result', val)
    },

    tokenError (val) {
      if (val) {
        this.$toasted.error(val, { icon: 'icon-attention' })
      }
    }
  },

  beforeCreate () {
    if (this.$store.getters.apiKey) {
      this.$router.replace({ name: 'Dashboard' })
    }
  },

  created () {
    this.reset()
  },

  beforeDestroy () {
    this.reset()
  },

  methods: {
    ...mapActions({
      tokenCreate: 'oneTimePassword/create',
      tokenReset: 'oneTimePassword/reset'
    }),

    validateState (ref) {
      if (this.veeFields[ref] && (this.veeFields[ref].dirty || this.veeFields[ref].validated)) {
        return !this.veeErrors.has(ref)
      }
      return null
    },

    submit () {
      this.$validator.validate().then((val) => {
        if (val) {
          this.tokenReset()
          this.tokenCreate({ receptor: this.receptor })
        } else {
          this.$toasted.error(this.veeErrors.all()[0], { icon: 'icon-attention' })
        }
      }).catch((val) => { console.log(val) })
    },

    reset () {
      this.tokenReset()
    }
  }
}
</script>
