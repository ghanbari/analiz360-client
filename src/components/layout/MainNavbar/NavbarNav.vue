<template>
  <d-navbar-nav class="border-left flex-row">
    <li class="nav-item border-right dropdown notifications">
      <a
        v-d-toggle.notifications
        class="nav-link nav-link-icon text-center"
      >
        <div class="nav-link-icon__wrapper">
          <bell-icon style="font-size: 24px" />
          <!--          <d-badge pill theme="danger">2</d-badge>-->
        </div>
      </a>
      <d-collapse
        id="notifications"
        class="dropdown-menu dropdown-menu-small my-auto"
      >
        <!--        <d-dropdown-item>-->
        <!--          <div class="notification__icon-wrapper">-->
        <!--            <div class="notification__icon">-->
        <!--              <i class="material-icons">&#xE6E1;</i>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--          <div class="notification__content">-->
        <!--            <span class="notification__category">Analytics</span>-->
        <!--            <p>Your website’s active users count increased by <span class="text-success text-semibold">28%</span> in the last week. Great job!</p>-->
        <!--          </div>-->
        <!--        </d-dropdown-item>-->
        <!--        <d-dropdown-item href="#">-->
        <!--          <div class="notification__icon-wrapper">-->
        <!--            <div class="notification__icon">-->
        <!--              <i class="material-icons">&#xE8D1;</i>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--          <div class="notification__content">-->
        <!--            <span class="notification__category">Sales</span>-->
        <!--            <p>Last week your store’s sales count decreased by <span class="text-danger text-semibold">5.52%</span>. It could have been worse!</p>-->
        <!--          </div>-->
        <!--        </d-dropdown-item>-->
        <d-dropdown-item class="notification__all text-center">
          View all Notifications
        </d-dropdown-item>
      </d-collapse>
    </li>
    <li
      id="user-menu"
      class="nav-item dropdown"
    >
      <a
        v-d-toggle.user-actions
        class="nav-link dropdown-toggle text-nowrap px-3"
      >
        <!--        <img class="user-avatar rounded-circle mr-2" src="/assets/images/avatars/0.jpg" alt="User Avatar"> <span class="d-none d-md-inline-block">Sierra Brooks</span>-->
        <gravatar
          :size="40"
          :email="$user.email ? $user.email : ''"
          class="user-avatar rounded-circle mr-2"
          alt="User Avatar"
        />
        <span class="d-none d-md-inline-block fullName">{{ $user.firstName + ' ' + $user.lastName }}</span>
      </a>
      <d-collapse
        id="user-actions"
        class="dropdown-menu dropdown-menu-small"
      >
        <d-dropdown-item :to="{name: 'UserUpdateProfile', query: {type: 1}}">
          <account-icon /> ویرایش پروفایل
        </d-dropdown-item>
        <d-dropdown-item :to="{name: 'ShopProducts', query: {type: 1}}">
          <coin-icon /> افزایش موجودی
        </d-dropdown-item>
        <d-dropdown-item :to="{name: 'WalletList'}">
          <credit-card-icon /> مشاهده کیف پول
        </d-dropdown-item>
        <d-dropdown-item :to="{name: 'UserPasswordUpdate'}">
          <lock-icon /> تغییر رمزعبور
        </d-dropdown-item>
        <d-dropdown-divider />
        <a
          class="dropdown-item"
          role="menuitem"
          href="#"
          @click="logout"
        >
          <logout-icon /> خروج
        </a>
      </d-collapse>
    </li>
  </d-navbar-nav>
</template>

<script>
import Gravatar from 'vue-gravatar'
import BellIcon from "vue-material-design-icons/Bell.vue"
import AccountIcon from "vue-material-design-icons/Account.vue"
import CoinIcon from "vue-material-design-icons/Coin.vue"
import CreditCardIcon from "vue-material-design-icons/CreditCard.vue"
import LockIcon from "vue-material-design-icons/Lock.vue"
import LogoutIcon from "vue-material-design-icons/Logout.vue"
import { mapActions } from 'vuex'

export default {
  components: {
    Gravatar,
    BellIcon,
    CoinIcon,
    CreditCardIcon,
    LockIcon,
    LogoutIcon,
    AccountIcon,
  },

  methods: {
    ...mapActions({
      logout: 'logout'
    })
  }
}
</script>

<style lang="scss">
  #user-menu {
    .fullName {
      max-width: 100px;
    }
  }

  .nav-link:hover {
    cursor: pointer;
  }

  .dropdown-menu#user-actions,
  .dropdown-menu#notifications {
    right: unset;
    left: 0;
  }
</style>
