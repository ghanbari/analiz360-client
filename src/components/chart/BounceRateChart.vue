<template>
  <apexchart
    :options="options"
    :series="[{name: 'bounce rate', data: series}]"
    class="apexcharts-area time-on-site"
    type="area"
    height="250"
  />
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import merge from 'lodash/merge'
import cloneDeep from 'lodash/cloneDeep'
import DefaultOptions from './DefaultOptions'

export default {
  name: 'BounceRateChart',

  components: {
    apexchart: VueApexCharts
  },

  props: {
    chartOptions: {
      type: Object,
      default () {
        return {}
      }
    },

    statistics: {
      type: Object,
      required: true
    }
  },

  computed: {
    series () {
      const data = []
      for (const date in this.statistics) {
        data.push([date, this.statistics[[date]]])
      }
      return data
    },

    options () {
      const options = {
        yaxis: {
          labels: {
            formatter (val) {
              return `${val.toFixed(2)}%`
            }
          }
        }
      }

      return merge(cloneDeep(DefaultOptions), options, this.chartOptions)
    }
  }
}
</script>

<style scoped>

</style>
