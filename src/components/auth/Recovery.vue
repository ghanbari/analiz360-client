<template>
  <b-form
    autocomplete="off"
    @submit.prevent="submit()"
  >
    <h1 class="d-none d-sm-block">بازیابی رمزعبور</h1>
    <h2 class="d-block d-sm-none text-center">بازیابی رمزعبور</h2>
    <p class="text-muted text-center text-sm-right">
      لطفا اطلاعات حساب خود را وارد نمایید
    </p>
    <b-input-group class="mb-3">
      <b-input-group-append><b-input-group-text><i class="icon-user-secret" /></b-input-group-text></b-input-group-append>
      <b-form-input
        v-model="token"
        v-validate="'required'"
        name="token"
        required="required"
        type="text"
        data-vv-as="شناسه امنیتی"
        :state="!isInvalid('token') && validateState('token')"
        placeholder="شناسه امنیتی"
        autocomplete="off"
      />
      <b-form-invalid-feedback>
        <span v-if="violations.hasOwnProperty('token')">{{ violations.token }}</span>
        <span v-else>{{ veeErrors.first('token') }}</span>
      </b-form-invalid-feedback>
    </b-input-group>

    <b-input-group class="mb-3">
      <b-input-group-append><b-input-group-text><i class="icon-key" /></b-input-group-text></b-input-group-append>
      <b-form-input
        ref="password"
        v-model="password"
        v-validate="'required|min:6'"
        name="password"
        required="required"
        type="password"
        data-vv-as="رمزعبور"
        :state="!isInvalid('password') && validateState('password')"
        placeholder="رمزعبور"
        autocomplete="off"
      />
      <b-form-invalid-feedback>
        <span v-if="violations.hasOwnProperty('password')">{{ violations.password }}</span>
        <span v-else>{{ veeErrors.first('password') }}</span>
      </b-form-invalid-feedback>
    </b-input-group>

    <b-input-group class="mb-4">
      <b-input-group-append><b-input-group-text><i class="icon-key" /></b-input-group-text></b-input-group-append>
      <b-form-input
        v-model="passwordConfirm"
        v-validate="'required|min:6|confirmed:password'"
        name="passwordConfirm"
        required="required"
        type="password"
        data-vv-as="رمزعبور"
        :state="!isInvalid('passwordConfirm') && validateState('passwordConfirm')"
        placeholder="رمزعبور"
        autocomplete="off"
      />
      <b-form-invalid-feedback>
        <span v-if="violations.hasOwnProperty('password')">{{ violations.password }}</span>
        <span v-else>{{ veeErrors.first('passwordConfirm') }}</span>
      </b-form-invalid-feedback>
    </b-input-group>

    <b-row>
      <b-col
        cols="12"
        class="ml-auto mt-auto"
      >
        <b-button
          :disabled="passwordRecoveryLoading || veeErrors.any()"
          type="submit"
          variant="success"
          class="active px-3 px-sm-4 d-block d-sm-inline mx-auto mr-sm-2"
        >
          بازیابی
        </b-button>
        <b-button
          variant="danger"
          class="px-4 d-block d-sm-inline mt-2 mt-sm-0 mx-auto mr-sm-2"
          @click="$emit('reset-token')"
        >
          <span class="icon-refresh" />
        </b-button>
        <router-link
          to="login"
          tag="button"
          class="btn btn-primary d-block d-sm-none mt-2 mt-sm-0 mx-auto mr-sm-2 px-3"
        >
          ورود
        </router-link>
      </b-col>
    </b-row>
  </b-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Recovery',

  props: {
    receptor: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      token: '',
      password: '',
      passwordConfirm: '',
      passwordError: false
    }
  },

  computed: {
    ...mapGetters({
      passwordRecoveryError: 'passwordRecovery/error',
      passwordRecoveryLoading: 'passwordRecovery/isLoading',
      passwordRecoveryCreated: 'passwordRecovery/created',
      passwordRecoveryViolations: 'passwordRecovery/violations',
      user: 'user/profile/retrieved',
      apiKey: 'apiKey'
    }),

    violations () {
      return this.passwordRecoveryViolations || {}
    },

    registrationType () {
      return this.$remoteConfig.get('registration.type', null)
    }
  },

  watch: {
    apiKey (newKey) {
      if (newKey) {
        this.profileLoad({ auth: true })
      }
    },

    user (user) {
      if (user) {
        this.$router.push(this.$route.query.hasOwnProperty('redirect') ? this.$route.query.redirect : '/')
      }
    },

    passwordRecoveryError (val) {
      this.$toasted.clear()

      if (val) {
        this.$toasted.error(val, { icon: 'icon-attention' })
      }
    },

    passwordRecoveryCreated () {
      const username = this.receptor
      const { password } = this
      this.login({ username, password })
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
      passwordRecoveryCreate: 'passwordRecovery/create',
      passwordRecoveryReset: 'passwordRecovery/reset',
      profileLoad: 'user/profile/retrieve',
      login: 'login'
    }),

    isInvalid (key) {
      if (Object.keys(this.violations).length > 0) {
        return this.violations.hasOwnProperty(key)
      }

      return null
    },

    validateState (ref) {
      if (this.veeFields[ref] && (this.veeFields[ref].dirty || this.veeFields[ref].validated)) {
        return !this.veeErrors.has(ref)
      }
      return null
    },

    submit () {
      this.$validator.validate().then((val) => {
        if (val) {
          this.passwordRecoveryCreate({ receptor: this.receptor, token: this.token, password: this.password })
        } else {
          this.$toasted.error(this.veeErrors.all()[0], { icon: 'icon-attention' })
        }
      }).catch((val) => { console.log(val) })
    },

    reset () {
      this.passwordRecoveryReset()
    }
  }
}
</script>
