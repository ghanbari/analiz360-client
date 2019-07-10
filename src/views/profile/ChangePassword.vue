<template>
  <d-container
    fluid
    class="main-content-container px-4"
  >
    <b-row class="py-5">
      <b-col
        md="6"
        class="mx-auto"
      >
        <b-card class="card-small">
          <d-card-header class="border-bottom">
            <h6 class="m-0">
              تغییر رمز عبور
            </h6>
          </d-card-header>

          <d-list-group flush>
            <d-list-group-item class="p-3">
              <d-row v-if="tokenCreated">
                <d-col>
                  <d-form @submit.prevent="submit()">
                    <div class="form-group">
                      <label for="feInputToken">شناسه امنیتی</label>
                      <b-form-input
                        id="feInputToken"
                        v-model="token"
                        v-validate="'required'"
                        name="token"
                        required="required"
                        type="text"
                        data-vv-as="کد امنیتی"
                        :state="!isInvalid('token') && validateState('token')"
                        placeholder="شناسه امنیتی"
                      />
                      <b-form-invalid-feedback>
                        <span v-if="passwordRecoveryViolations && passwordRecoveryViolations.hasOwnProperty('token')">{{ passwordRecoveryViolations.token }}</span>
                        <span v-else>{{ veeErrors.first('token') }}</span>
                      </b-form-invalid-feedback>
                    </div>

                    <d-form-row>
                      <d-col
                        md="6"
                        class="form-group"
                      >
                        <label for="feInputPassword">رمز عبور</label>
                        <b-form-input
                          id="feInputPassword"
                          ref="password"
                          v-model="password"
                          v-validate="'required|min:6'"
                          name="password"
                          required="required"
                          type="password"
                          data-vv-as="رمزعبور"
                          :state="!isInvalid('password') && validateState('password')"
                          placeholder="رمز عبور"
                          autocomplete="off"
                        />
                        <b-form-invalid-feedback>
                          <span v-if="passwordRecoveryViolations && passwordRecoveryViolations.hasOwnProperty('password')">{{ passwordRecoveryViolations.password }}</span>
                          <span v-else>{{ veeErrors.first('password') }}</span>
                        </b-form-invalid-feedback>
                      </d-col>

                      <d-col
                        md="6"
                        class="form-group"
                      >
                        <label for="feInputPasswordConfirm">تکرار رمز عبور</label>
                        <b-form-input
                          id="feInputPasswordConfirm"
                          v-model="passwordConfirm"
                          v-validate="'required|min:6|confirmed:password'"
                          name="passwordConfirm"
                          required="required"
                          type="password"
                          data-vv-as="رمزعبور"
                          :state="!isInvalid('passwordConfirm') && validateState('passwordConfirm')"
                          placeholder="تکرار رمز عبور"
                          autocomplete="off"
                        />
                        <b-form-invalid-feedback>
                          <span v-if="passwordRecoveryViolations && passwordRecoveryViolations.hasOwnProperty('password')">{{ passwordRecoveryViolations.password }}</span>
                          <span v-else>{{ veeErrors.first('passwordConfirm') }}</span>
                        </b-form-invalid-feedback>
                      </d-col>
                    </d-form-row>

                    <b-row>
                      <b-col
                        cols="12"
                        class="ml-auto"
                      >
                        <b-button
                          v-if="tokenCreated"
                          :disabled="passwordRecoveryLoading || veeErrors.any()"
                          type="submit"
                          variant="success"
                          class="active px-4 d-block d-sm-inline mx-auto"
                        >
                          بروزرسانی
                        </b-button>
                        <b-button
                          v-if="tokenCreated"
                          variant="danger"
                          class="d-block d-sm-inline px-4 mx-auto mr-sm-2 mt-2 mt-sm-0"
                          @click="tokenReset() && tokenCreate({receptor})"
                        >
                          <span class="icon-refresh" /> ارسال مجدد کد امنیتی
                        </b-button>
                      </b-col>
                    </b-row>
                  </d-form>
                </d-col>
              </d-row>
              <d-row v-else>
                <d-col md="12">
                  <span v-if="tokenError">{{ tokenError }}</span>
                  <span v-else-if="receptor">در حال ارسال کد امنیتی به {{ receptor }}</span>
                </d-col>
              </d-row>
            </d-list-group-item>
          </d-list-group>
        </b-card>
      </b-col>
    </b-row>
  </d-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ChangePassword',

  data () {
    return {
      receptor: '',
      token: '',
      password: '',
      passwordConfirm: '',
      passwordError: false
    }
  },

  computed: {
    ...mapGetters({
      tokenError: 'oneTimePassword/error',
      tokenLoading: 'oneTimePassword/isLoading',
      tokenCreated: 'oneTimePassword/created',
      tokenTimer: 'oneTimePassword/timer',
      passwordRecoveryError: 'passwordRecovery/error',
      passwordRecoveryLoading: 'passwordRecovery/isLoading',
      passwordRecoveryCreated: 'passwordRecovery/created',
      passwordRecoveryViolations: 'passwordRecovery/violations'
    }),

    violations () {
      return this.passwordRecoveryViolations || {}
    },

    registrationType () {
      return this.$remoteConfig.get('registration.type', null)
    }
  },

  watch: {
    registrationType () {
      this.setReceptor()
    },

    $user () {
      this.setReceptor()
    },

    receptor (val) {
      if (val) {
        this.tokenReset()
        this.tokenCreate({ receptor: this.receptor })
      }
    },

    tokenCreated (val) {
      if (val) {
        this.$toasted.info(val, { icon: 'icon-ok' })
      }
    },

    tokenError (val) {
      if (val) {
        this.$toasted.error(val, { icon: 'icon-attention' })
      }
    },

    passwordRecoveryError (val) {
      if (val) {
        this.$toasted.error(val, { icon: 'icon-attention' })
      }
    },

    passwordRecoveryCreated () {
      this.$toasted.success('رمزعبور شما بروزرسانی شد', { icon: 'icon-key' })
      setTimeout(() => this.$router.push({ name: 'Dashboard' }), 2000)
    }
  },

  created () {
    this.reset()
    this.setReceptor()
  },

  beforeDestroy () {
    this.reset()
  },

  methods: {
    ...mapActions({
      tokenCreate: 'oneTimePassword/create',
      tokenReset: 'oneTimePassword/reset',
      passwordRecoveryCreate: 'passwordRecovery/create',
      passwordRecoveryReset: 'passwordRecovery/reset'
    }),

    setReceptor () {
      if (this.$user && this.registrationType) {
        if (this.registrationType === 'phone') {
          this.receptor = this.$user.phone
        } else {
          this.receptor = this.$user.email
        }
      }
    },

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
      this.tokenReset()
      this.passwordRecoveryReset()
    }
  }
}
</script>
