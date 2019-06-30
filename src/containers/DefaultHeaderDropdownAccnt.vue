<template>
  <AppHeaderDropdown
    v-if="$user"
    left
    no-caret
    class="userInfo"
    style="width: 200px;"
  >
    <template slot="header">
      <span style="color: darkorange">{{ $user.credit ? $user.credit : 0 }} <img src="images/l32.png"></span>
      <gravatar
        :size="40"
        :email="$user.email ? $user.email : ''"
        alt="Me"
        class="img-avatar"
      />
    </template>\
    <template slot="dropdown">
      <b-dropdown-header
        tag="div"
        class="head text-right"
      >
        <gravatar
          :size="40"
          :email="$user.email ? $user.email : ''"
          class="img-avatar"
        />
        <span class="name">{{ $user.firstName + ' ' + $user.lastName }}</span>
        <span class="username">{{ $user.username }}</span>
      </b-dropdown-header>

      <router-link
        :to="{name: 'UserUpdateProfile', query: {type: 1}}"
        class="dropdown-item"
        role="menuitem"
      >
        <i class="icon-user" /> ویرایش پروفایل
      </router-link>

      <router-link
        :to="{name: 'ShopProducts', query: {type: 1}}"
        class="dropdown-item"
        role="menuitem"
      >
        <i class="icon-money" />افزایش موجودی
      </router-link>

      <router-link
        :to="{name: 'WalletList'}"
        class="dropdown-item"
        role="menuitem"
      >
        <i class="icon-wallet" /> مشاهده کیف پول
      </router-link>

      <router-link
        :to="{name: 'UserPasswordUpdate'}"
        class="dropdown-item"
        role="menuitem"
      >
        <i class="icon-key" /> تغییر رمزعبور
      </router-link>
      <a
        class="dropdown-item"
        role="menuitem"
        href="#"
        @click="logout"
      ><i class="icon-lock" /> خروج</a>
    </template>
  </AppHeaderDropdown>
</template>

<script>
import { mapActions } from 'vuex'
import { HeaderDropdown as AppHeaderDropdown } from '@coreui/vue'
import Gravatar from 'vue-gravatar'

export default {
  name: 'DefaultHeaderDropdownAccnt',

  components: {
    AppHeaderDropdown,
    Gravatar
  },

  data: () => ({
    itemsCount: 42
  }),

  methods: {
    ...mapActions({
      logout: 'logout'
    })
  }
}
</script>
