<template>
  <b-form
    autocomplete="off"
    @submit.prevent="submit()"
  >
    <h1>ثبت نام</h1>
    <p class="text-muted">
      لطفا اطلاعات خود را وارد نمایید
    </p>
    <b-input-group class="mb-3">
      <b-input-group-append><b-input-group-text><i class="icon-user" /></b-input-group-text></b-input-group-append>
      <b-form-input
        v-model="register.firstName"
        v-validate="'required|max:255'"
        name="firstName"
        required="required"
        type="text"
        data-vv-as="نام"
        :state="!isInvalid('firstName') && validateState('firstName')"
        placeholder="نام"
        autocomplete="off"
      />
      <b-form-invalid-feedback>
        <span v-if="violations.hasOwnProperty('firstName')">{{ violations.firstName }}</span>
        <span v-else>{{ veeErrors.first('firstName') }}</span>
      </b-form-invalid-feedback>
    </b-input-group>

    <b-input-group class="mb-3">
      <b-input-group-append><b-input-group-text><i class="icon-user" /></b-input-group-text></b-input-group-append>
      <b-form-input
        v-model="register.lastName"
        v-validate="'required|max:255'"
        name="lastName"
        required="required"
        type="text"
        data-vv-as="نام خانوادگی"
        :state="!isInvalid('lastName') && validateState('lastName')"
        placeholder="نام خانوادگی"
        autocomplete="off"
      />
      <b-form-invalid-feedback>
        <span v-if="violations.hasOwnProperty('lastName')">{{ violations.lastName }}</span>
        <span v-else>{{ veeErrors.first('lastName') }}</span>
      </b-form-invalid-feedback>
    </b-input-group>

    <b-input-group class="mb-3">
      <b-input-group-append><b-input-group-text><i class="icon-user-secret" /></b-input-group-text></b-input-group-append>
      <b-form-input
        v-model="register.token"
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
        v-model="register.rawPassword"
        v-validate="'required|min:6|max:255'"
        name="rawPassword"
        required="required"
        type="password"
        data-vv-as="رمزعبور"
        :state="!isInvalid('rawPassword') && validateState('rawPassword')"
        placeholder="رمزعبور"
        autocomplete="off"
      />
      <b-form-invalid-feedback>
        <span v-if="violations.hasOwnProperty('rawPassword')">{{ violations.rawPassword }}</span>
        <span v-else>{{ veeErrors.first('rawPassword') }}</span>
      </b-form-invalid-feedback>
    </b-input-group>

    <b-input-group class="mb-4">
      <b-input-group-append><b-input-group-text><i class="icon-users" /></b-input-group-text></b-input-group-append>
      <b-form-input
        v-model="register.referrerCode"
        type="text"
        :state="!isInvalid('referrerCode') && validateState('referrerCode')"
        style="border-radius: 0"
        placeholder="کد معرف"
        autocomplete="off"
      />
      <div
        v-if="isInvalid('referrerCode')"
        class="invalid-feedback"
      >
        {{ violations.referrerCode }}
      </div>
    </b-input-group>
    <b-row>
      <b-col
        cols="12"
        class="ml-auto mt-auto"
      >
        <b-button
          :disabled="userLoading || veeErrors.any()"
          type="submit"
          variant="success"
          class="active px-4"
        >
          ثبت نام
        </b-button>
        <b-button
          variant="danger"
          class="active px-4 mr-1"
          @click="$emit('reset-token')"
        >
          <span class="icon-refresh" />
        </b-button>
        <router-link
          to="login"
          tag="button"
          class="btn btn-primary active d-sm-none d-xs-inline mr-1"
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
  name: 'Register',

  props: {
    receptor: {
      type: String,
      required: true
    },
    referrerCodeInit: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      register: {
        token: '',
        firstName: '',
        lastName: '',
        rawPassword: '',
        referer: '',
        publicRegistration: true,
        referrerCode: this.referrerCodeInit
      }
    }
  },

  computed: {
    ...mapGetters({
      userError: 'user/create/error',
      userLoading: 'user/create/isLoading',
      userCreated: 'user/create/created',
      userViolations: 'user/create/violations',
      user: 'user/profile/retrieved',
      apiKey: 'apiKey'
    }),

    violations () {
      return this.userViolations || {}
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

    userError (val) {
      this.$toasted.clear()

      if (val) {
        this.$toasted.error(val, { icon: 'icon-attention' })
      }
    },

    userCreated () {
      const username = this.receptor
      const password = this.register.rawPassword
      this.login({ username, password })
    }
  },

  beforeCreate () {
    if (this.$store.getters.apiKey) {
      this.$router.replace({ name: 'Dashboard' })
    }
  },

  created () {
    if (this.registrationType === 'phone') {
      this.register.phone = this.receptor
    } else {
      this.register.email = this.receptor
    }
  },

  beforeDestroy () {
    this.reset()
  },

  methods: {
    ...mapActions({
      userCreate: 'user/create/create',
      userReset: 'user/create/reset',
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
          this.userCreate(this.register)
        } else {
          this.$toasted.error(this.veeErrors.all()[0], { icon: 'icon-attention' })
        }
      }).catch((val) => { console.log(val) })
    },

    reset () {
      this.userReset()
    }
  }
}
</script>
