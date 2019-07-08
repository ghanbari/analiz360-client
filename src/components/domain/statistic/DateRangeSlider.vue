<template>
  <b-row
    v-if="currentPlan"
    class="slider"
  >
    <b-col
      cols="12"
      class="pb-3"
    >
      <b-card>
        <vue-slider
          v-model="sliderValue"
          :enable-cross="false"
          :tooltip="'always'"
          :marks="true"
          :hide-label="true"
          :tooltip-placement="['top', 'bottom']"
          :min="sliderOption.min"
          :max="sliderOption.max"
          :interval="sliderOption.interval"
          :tooltip-formatter="val => (new Date(val)).toLocaleDateString('fa-IR')"
          @drag-end="$emit('update:slider', sliderValue)"
        />
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import VueSlider from 'vue-slider-component'

export default {
  components: {
    VueSlider
  },

  props: {
    domain: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      sliderValue: [this.getToday().getTime() - (86400000 * 5), this.getToday().getTime()]
    }
  },

  computed: {
    ...mapGetters({
      watchingPlans: 'domainWatcher/list/items'
    }),

    sliderOption () {
      const history = this.currentPlan ? this.currentPlan.history : 5
      const today = this.getToday()
      let end = today.getTime()
      const start = end - (history * 86400000)
      const interval = (history < 50) ? 86400000 : (86400000 * Math.round(history / 50))
      end -= ((end - start) % interval)

      return {
        min: start,
        max: end,
        interval: interval || 86400000
      }
    },

    currentPlan () {
      return this.watchingPlans.length > 0 ? this.watchingPlans[0] : null
    }
  },

  watch: {
    domain: {
      deep: true,
      immediate: true,
      handler (val) {
        if (val) {
          this.getDomainWatchersList({ query: { 'domain.domain': val.domain, order: { expireAt: 'desc' } } })
        }
      }
    },

    sliderOption () {
      if (this.sliderOption) {
        this.sliderValue[0] = this.sliderOption.min
        this.sliderValue[1] = this.sliderOption.max
      }
    },

    sliderValue (val) {
      this.$emit('update:slider', val)
    }
  },

  beforeDestroy () {
    this.reset()
  },

  methods: {
    ...mapActions({
      getDomainWatchersList: 'domainWatcher/list/getItems',
      domainWatchersReset: 'domainWatcher/list/reset'
    }),

    getToday () {
      const today = new Date()
      today.setHours(0)
      today.setMinutes(0)
      today.setSeconds(0)
      today.setMilliseconds(0)

      return today
    },

    reset () {
      this.domainWatchersReset()
    }
  }
}
</script>

<style lang="scss">
  @import '~vue-slider-component/theme/antd.css';
</style>
