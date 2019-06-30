<template>
  <apexchart
    :options="options"
    :series="[{name: 'بازدید روزانه', data: series}]"
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
  name: 'PageViewChart',

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
        stacked: true,
        yaxis: {
          labels: {
            formatter (val) {
              return val.toFixed(3)
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
