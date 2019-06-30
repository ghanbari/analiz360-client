<template>
  <div>
    <one-time-password
      v-if="!tokenCreated"
      :receptor.sync="receptor"
      :token-creation-result.sync="tokenCreated"
    />
    <register
      v-else
      :referer-code-init="refererCode"
      :receptor="receptor"
      @reset-token="resetToken()"
    />
  </div>
</template>

<script>
import OneTimePassword from '../../components/auth/OneTimePassword'
import Register from '../../components/auth/Register'

export default {
  name: 'RegisterView',
  components: {
    OneTimePassword,
    Register
  },

  data () {
    return {
      tokenCreated: false,
      receptor: '',
      refererCode: ''
    }
  },

  beforeCreate () {
    if (this.$route.query.hasOwnProperty('code')) {
      this.referrerCode = this.$route.query.code
    }
  },

  methods: {
    resetToken () {
      this.tokenCreated = false
    }
  }
}
</script>
