<template>
  <div>
    <one-time-password
      v-if="!tokenCreated"
      :receptor.sync="receptor"
      :token-creation-result.sync="tokenCreated"
    />
    <recovery
      v-else
      :receptor="receptor"
      @reset-token="resetToken()"
    />
  </div>
</template>

<script>
import OneTimePassword from '../../components/auth/OneTimePassword'
import Recovery from '../../components/auth/Recovery'

export default {
  name: 'RecoveryView',
  components: {
    OneTimePassword,
    Recovery
  },

  data () {
    return {
      tokenCreated: false,
      receptor: ''
    }
  },

  methods: {
    resetToken () {
      this.tokenCreated = false
    }
  }
}
</script>
