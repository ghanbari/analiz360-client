<template>
  <d-card class="card-small mb-4">
    <!-- Card Header -->
    <d-card-header class="border-bottom">
      <h6 class="m-0">
        تغییر پست الکترونیک
      </h6>
    </d-card-header>

    <d-list-group flush>
      <d-list-group-item class="p-3">
        <d-row>
          <d-col>
            <d-form @submit.prevent="submit()">
              <div class="form-group">
                <template v-if="!tokenCreated && registrationType">
                  <label for="feInputEmail">پست الکترونیک</label>
                  <b-form-input
                    id="feInputEmail"
                    v-validate="'required|email'"
                    name="email"
                    required="required"
                    type="email"
                    data-vv-as="پست الکترونیک"
                    :state="!isInvalid('email') && validateState('email')"
                    placeholder="پست الکترونیک"
                    autocomplete="email"
                    :value="email"
                    @input="setEmail($event)"
                  />
                  <b-form-invalid-feedback>
                    <span v-if="emailVerifyViolations && emailVerifyViolations.hasOwnProperty('email')">{{ emailVerifyViolations.email }}</span>
                    <span v-else>{{ veeErrors.first('email') }}</span>
                  </b-form-invalid-feedback>
                </template>
                <template v-else>
                  <label for="feInputToken">شناسه امنیتی</label>
                  <b-form-input
                    id="feInputToken"
                    v-validate="'required'"
                    name="token"
                    required="required"
                    type="text"
                    data-vv-as="شناسه امنیتی"
                    :state="!isInvalid('token') && validateState('token')"
                    placeholder="شناسه امنیتی"
                    autocomplete="off"
                    :value="token"
                    @input="setToken($event)"
                  />
                  <b-form-invalid-feedback>
                    <span v-if="emailVerifyViolations && emailVerifyViolations.hasOwnProperty('token')">{{ emailVerifyViolations.token }}</span>
                    <span v-else>{{ veeErrors.first('token') }}</span>
                  </b-form-invalid-feedback>
                </template>
              </div>

              <div class="form-group">
                <b-button
                  v-if="!tokenCreated && registrationType"
                  :disabled="tokenLoading || veeErrors.any()"
                  type="submit"
                  variant="success"
                  class="active mt-1"
                >
                  ارسال کد
                </b-button>
                <b-button
                  v-if="tokenCreated"
                  :disabled="emailVerifyLoading || veeErrors.any()"
                  type="submit"
                  variant="success"
                  class="active px-4 mr-2"
                >
                  بروزرسانی
                </b-button>
                <b-button
                  v-if="tokenCreated"
                  variant="danger"
                  class="active px-4 mr-2"
                  @click="tokenReset() && tokenCreate({receptor: email})"
                >
                  <span class="icon-refresh" />
                </b-button>
              </div>
            </d-form>
          </d-col>
        </d-row>
      </d-list-group-item>
    </d-list-group>
  </d-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ChangeEmail',

  computed: {
    ...mapGetters({
      tokenError: 'oneTimePassword/error',
      tokenLoading: 'oneTimePassword/isLoading',
      tokenCreated: 'oneTimePassword/created',
      tokenTimer: 'oneTimePassword/timer',
      emailVerifyViolations: 'user/emailVerify/violations',
      emailVerifyError: 'user/emailVerify/error',
      emailVerifyLoading: 'user/emailVerify/isLoading',
      userUpdated: 'user/emailVerify/updated',
      email: 'user/emailVerify/email',
      token: 'user/emailVerify/token'
    }),

    violations () {
      return this.emailVerifyViolations || {}
    },

    registrationType () {
      return this.$remoteConfig.get('registration.type', null)
    }
  },

  watch: {
    tokenCreated (val) {
      this.$toasted.clear()

      if (val) {
        this.$toasted.info(val, { icon: 'icon-user' })
      }
    },

    tokenError (val) {
      if (val) {
        this.$toasted.error(val, { icon: 'icon-attention' })
      }
    },

    emailVerifyError (val) {
      this.$toasted.clear()

      if (val) {
        this.$toasted.error(val, { icon: 'icon-attention' })
      }
    },

    userUpdated () {
      this.userProfileReload({ fresh: true })
      this.$toasted.success('پست الکترونیک شما بروزرسانی شد', { icon: 'icon-mail' })
      this.$router.push({ name: 'Dashboard' })
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
      tokenReset: 'oneTimePassword/reset',
      emailVerify: 'user/emailVerify/verify',
      emailVerifyReset: 'user/emailVerify/reset',
      setEmail: 'user/emailVerify/setEmail',
      setToken: 'user/emailVerify/setToken',
      userProfileReload: 'user/profile/retrieve'
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
          if (!this.tokenCreated) {
            this.tokenReset()
            this.tokenCreate({ receptor: this.email })
          } else {
            this.emailVerify()
          }
        } else {
          this.$toasted.error(this.veeErrors.all()[0], { icon: 'icon-attention' })
        }
      }).catch((val) => { console.log(val) })
    },

    reset () {
      this.tokenReset()
      this.emailVerifyReset()
    }
  }
}
</script>
