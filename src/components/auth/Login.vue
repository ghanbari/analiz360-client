<template>
  <b-form @submit.prevent="login(credentials)">
    <h1 class="d-none d-sm-block">ورود</h1>
    <h2 class="d-block d-sm-none text-center">ورود</h2>
    <p class="text-muted text-center text-sm-right">
      لطفا اطلاعات حساب خود را وارد نمایید
    </p>
    <b-input-group class="mb-3">
      <b-input-group-append><b-input-group-text><i class="icon-user" /></b-input-group-text></b-input-group-append>
      <b-form-input
        v-model="credentials.username"
        :required="true"
        type="text"
        class="form-control text-center"
        placeholder="نام کاربری"
        autocomplete="username email"
      />
    </b-input-group>
    <b-input-group class="mb-4">
      <b-input-group-append><b-input-group-text><i class="icon-lock" /></b-input-group-text></b-input-group-append>
      <b-form-input
        v-model="credentials.password"
        :required="true"
        type="password"
        class="form-control text-center"
        placeholder="رمزعبور"
        autocomplete="current-password"
      />
    </b-input-group>
    <b-row>
      <b-col sm="6">
        <b-button
          type="submit"
          variant="success"
          class="px-4 d-block d-sm-inline mx-auto"
        >
          ورود
        </b-button>
        <router-link to="register">
          <b-button variant="primary" class="px-3 d-block d-sm-none mx-auto mr-sm-2 mt-2 mt-sm-0">ثبت نام</b-button>
        </router-link>
      </b-col>
      <b-col
        sm="6"
        class="text-left"
      >
        <router-link to="Recovery">
          <b-button
            variant="link"
            class="px-0 d-block d-sm-inline mt-2 mt-sm-0 mx-auto mr-sm-2"
          >
            بازیابی رمزعبور
          </b-button>
        </router-link>
      </b-col>
    </b-row>
  </b-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Login',
  data () {
    return {
      credentials: {
        username: '',
        password: ''
      }
    }
  },

  computed: {
    ...mapGetters({
      message: 'apiKeyError',
      apiKey: 'apiKey',
      user: 'user/profile/retrieved'
    })
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

    message (val) {
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

  methods: {
    ...mapActions({
      login: 'login',
      profileLoad: 'user/profile/retrieve'
    })
  }
}
</script>
