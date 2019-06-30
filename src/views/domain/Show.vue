<template>
  <d-container
    fluid
    class="main-content-container px-4"
  >
    <b-row
      v-if="domainError"
      class="error"
    >
      <b-col md="12">
        <b-card>
          <p class="text-center">
            {{ domainError }}
          </p>
        </b-card>
      </b-col>
    </b-row>

    <template v-if="domain && !domainError">
      <b-row class="basic">
        <b-col
          cols="12"
          class="py-3"
        >
          <b-card>
            <b-row>
              <b-col
                md="4"
                class="screenshot text-center"
              >
                <a :href="(domain.secure ? 'https://' : 'http://') + domain.domain">
                  <b-img
                    fluid
                    :src="'media/cache/resolve/site_screenshot/media/screenshot/'+domain.screenshot"
                    :onerror="'this.src=\''+defaultImage+'\''"
                  />
                </a>
              </b-col>
              <b-col
                md="8"
                class="details"
              >
                <span class="createdAt">{{ (new Date(domain.registrationDate)).toLocaleDateString('fa-IR') }}</span>
                <h4 class="name">
                  <a :href="(domain.secure ? 'https://' : 'http://') + domain.domain">{{ domain.name }}</a>
                </h4>
                <h6
                  v-if="domain.category"
                  class="category"
                >
                  {{ domain.category.path }}
                </h6>
                <div class="rank">
                  <!--                    <span class="global"><span class="fa fa-globe"></span> 5000</span>-->
                  <!--                    <span class="local"><span class="fa fa-globe"></span>2000</span>-->
                </div>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
      </b-row>

      <b-row
        v-if="domain"
        class="plans"
      >
        <b-col cols="12">
          <product-list
            theme="small"
            :filters="{type: 3}"
            :query-params="{domain: domain.domain}"
          />
        </b-col>
      </b-row>

      <date-range-slider
        :domain="domain"
        @update:slider="dateRange = $event"
      />

      <statistic-charts
        :domain="domain"
        :date-range="dateRange"
      />
    </template>
  </d-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import productList from '../../components/product/shop/List'
import DateRangeSlider from '../../components/domain/statistic/DateRangeSlider'
import StatisticCharts from '../../components/domain/statistic/StatisticCharts'

export default {
  components: {
    productList,
    DateRangeSlider,
    StatisticCharts
  },

  data () {
    const end = (new Date()).getTime()
    const start = end - (3 * 24 * 3600 * 1000)

    return {
      dateRange: [start, end]
    }
  },

  computed: {
    ...mapGetters({
      domainError: 'domain/show/error',
      domainLoading: 'domain/show/isLoading',
      domain: 'domain/show/retrieved'
    }),

    defaultImage () {
      return require('@/assets/images/logo/logo_lg.svg')
    }
  },

  beforeRouteUpdate (to, from, next) {
    this.reset()
    this.domainLoad(decodeURIComponent(to.params.domain))
    next()
  },

  created () {
    this.domainLoad(decodeURIComponent(this.$route.params.domain))
  },

  beforeDestroy () {
    this.reset()
  },

  methods: {
    ...mapActions({
      domainReset: 'domain/show/reset',
      domainLoad: 'domain/show/retrieve'
    }),

    reset () {
      this.domainReset()
    }
  }
}
</script>

<style lang="scss">
  .basic {
    .screenshot, .details {
      margin-bottom: 10px;
    }

    .screenshot {
      img {
        max-width: 288px;
        max-height: 200px;
        /*border: 2px solid darkgray;*/
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        border-radius: 5%;

        &:hover {
          box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.3), 0 9px 30px 0 rgba(0, 0, 0, 0.29);
        }
      }
    }

    .details {
      .createdAt {
        float: left;
      }

      .rank {
        margin: auto;
        text-align: center;
        width: 50%;
        font-size: 24px;
        font-weight: bold;
        float: left;

        .global {
          color: darkorange;
        }
      }
    }
  }

  .charts {
    .apexcharts-area {
      position: relative !important;
      left: -20px;
    }
  }
</style>
