<template>
  <footer class="main-footer d-flex p-2 px-3 bg-white border-top">
    <div :class="[contained ? 'container' : 'container-fluid']">
      <div class="row">
        <ul class="nav links">
          <li class="nav-item">
            <d-link
              class="nav-link home"
              href="https://analiz360.ir"
            >
              <home-icon />
            </d-link>
          </li>
          <li class="nav-item">
            <d-link
              class="nav-link instagram"
              href="https://analiz360.ir/instagram"
            >
              <instagram-icon />
            </d-link>
          </li>
          <li class="nav-item">
            <d-link
              class="nav-link telegram"
              href="https://analiz360.ir/telegram"
            >
              <telegram-icon />
            </d-link>
          </li>
          <li class="nav-item">
            <d-link
              class="nav-link twitter"
              href="https://analiz360.ir/twitter"
            >
              <twitter-icon />
            </d-link>
          </li>
        </ul>
        <span class="copyright ml-auto my-auto mr-2">Copyright © 2019 Analiz360</span>
        <span class="version mr-auto my-auto">version: {{ $config.get('version') }}</span>
      </div>
    </div>
  </footer>
</template>

<script>
import HomeIcon from "vue-material-design-icons/Home.vue"
import InstagramIcon from "vue-material-design-icons/Instagram.vue"
import TelegramIcon from "vue-material-design-icons/Telegram.vue"
import TwitterIcon from "vue-material-design-icons/Twitter.vue"

export default {
  name: 'MainFooter',
  components: {
    InstagramIcon,
    HomeIcon,
    TelegramIcon,
    TwitterIcon,
  },
  props: {
    /**
       * Whether the footer should be wrapped in a container, or not.
       */
    contained: {
      type: Boolean,
      default: false
    }
  }
}
</script>
