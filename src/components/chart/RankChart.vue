<template>
  <apexchart
    :options="options"
    :series="[{name: title, data: series}]"
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
  name: 'RankChart',

  components: {
    apexchart: VueApexCharts
  },

  props: {
    title: {
      type: String,
      required: true
    },

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
          reversed: true,
          labels: {
            formatter (val) {
              return val === Math.round(val) ? (new Intl.NumberFormat('fa-IR')).format(val) : ''
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
