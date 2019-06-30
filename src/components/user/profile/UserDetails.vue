<template>
  <d-card class="card-small mb-4 pt-3">
    <!-- Card Header -->
    <d-card-header class="border-bottom text-center">
      <!-- User Avatar -->
      <div class="mb-3 mx-auto">
        <gravatar
          :size="110"
          :email="$user.email ? $user.email : ''"
          class="rounded-circle"
          :alt="user.firstName + ' ' + user.lastName"
        />
      </div>

      <!-- User Name -->
      <h4 class="mb-0">
        {{ user.firstName + ' ' + user.lastName }}
      </h4>

      <!-- User Job Title -->
      <span class="text-muted d-block mb-2">{{ user.username }}</span>

      <!-- User Follow -->
      <router-link :to="{name: 'ShopProducts', query: {type: 1}}">
        <d-button
          pill
          outline
          size="sm"
          class="mb-2"
        >
          <span>شارژ حساب</span>
          {{ user.credit }}<span class="icon-money" />
        </d-button>
      </router-link>
    </d-card-header>

    <d-list-group flush>
      <!-- User Performance Report -->
      <d-list-group-item class="px-4">
        <div class="progress-wrapper">
          <strong class="text-muted d-block mb-2">تکمیل پروفایل</strong>
          <d-progress class="progress-sm">
            <span class="progress-value">10%</span>
            <d-progress-bar
              :max="100"
              :value="50"
            />
          </d-progress>
        </div>
      </d-list-group-item>

      <!-- User Meta -->
      <d-list-group-item>
        <strong class="text-muted d-block mb-2">{{ user.description }}</strong>
      </d-list-group-item>
    </d-list-group>
  </d-card>
</template>

<script>
import Gravatar from 'vue-gravatar'

export default {
  name: 'UserDetails',

  components: {
    Gravatar
  },

  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss">
  .progress-wrapper {
    .progress {
      .progress-value {
        left: 0;
        right: unset;
      }
    }
  }
</style>
