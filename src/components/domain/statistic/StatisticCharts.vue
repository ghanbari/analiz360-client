<template>
  <div>
    <b-row
      v-if="domainStatisticsError"
      class="error"
    >
      <b-col md="12">
        <b-card>
          <p class="text-center">
            {{ domainStatisticsError }}
          </p>
        </b-card>
      </b-col>
    </b-row>

    <b-row
      v-if="domainStatistics"
      class="charts no-gutters"
    >
      <b-col cols="12">
        <b-row>
          <b-col
            lg="6"
            cols="12"
            class="pb-2"
          >
            <b-card
              no-body
              class="px-2"
            >
              <rank-chart
                title="رتبه جهانی"
                :statistics="domainStatistics.globalRanks"
                class="apexcharts-area"
                type="area"
                height="250"
              />
            </b-card>
          </b-col>

          <b-col
            lg="6"
            cols="12"
            class="pb-2"
          >
            <b-card
              no-body
              class="px-2"
            >
              <rank-chart
                title="رتبه ایران"
                :statistics="domainStatistics.localRanks.length ? domainStatistics.localRanks : {}"
                class="apexcharts-area"
                type="area"
                height="250"
              />
            </b-card>
          </b-col>
        </b-row>

        <b-row>
          <b-col
            lg="6"
            cols="12"
            class="pb-2"
          >
            <b-card
              no-body
              class="px-2"
            >
              <bounce-rate-chart
                :statistics="domainStatistics.bounceRates"
                class="apexcharts-area"
                type="area"
                height="250"
              />
            </b-card>
          </b-col>

          <b-col
            lg="6"
            cols="12"
            class="pb-2"
          >
            <b-card
              no-body
              class="px-2"
            >
              <page-view-chart
                :statistics="domainStatistics.pageViews"
                class="apexcharts-area"
                type="area"
                height="250"
              />
            </b-card>
          </b-col>
        </b-row>

        <b-row>
          <b-col
            lg="6"
            cols="12"
            class="pb-2"
          >
            <b-card
              no-body
              class="px-2"
            >
              <time-on-site-chart
                :statistics="domainStatistics.timeOnSites"
                class="apexcharts-area"
                type="area"
                height="250"
              />
            </b-card>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import debounce from 'lodash/debounce'
import TimeOnSiteChart from '../../../components/chart/TimeOnSiteChart'
import PageViewChart from '../../../components/chart/PageViewChart'
import BounceRateChart from '../../../components/chart/BounceRateChart'
import RankChart from '../../../components/chart/RankChart'

export default {
  name: 'StatisticCharts',

  components: {
    TimeOnSiteChart,
    PageViewChart,
    BounceRateChart,
    RankChart
  },

  props: {
    domain: {
      type: Object,
      required: true
    },

    dateRange: {
      type: Array,
      required: true
    }
  },

  computed: {
    ...mapGetters({
      domainStatisticsError: 'statistics/domain/error',
      domainStatisticsLoading: 'statistics/domain/isLoading',
      domainStatistics: 'statistics/domain/retrieved'
    })
  },

  watch: {
    domain: {
      deep: true,
      immediate: true,
      handler (val) {
        if (val) {
          this.domainStatisticsLoad({ id: this.domain.id })
        }
      }
    },

    dateRange: debounce(function (val) {
      const after = (new Date(val[0])).toISOString().slice(0, 10)
      const before = (new Date(val[1])).toISOString().slice(0, 10)
      this.domainStatisticsLoad({ id: this.domain.id, query: { date: { after, before } } })
    }, 500)
  },

  beforeDestroy () {
    this.reset()
  },

  methods: {
    ...mapActions({
      domainStatisticsLoad: 'statistics/domain/retrieve',
      domainStatisticsReset: 'statistics/domain/reset'
    }),

    reset () {
      this.domainStatisticsReset()
    }
  }
}
</script>

<style scoped>

</style>
