<template>
  <d-container
    fluid
    class="main-content-container px-4 pt-5"
  >
    <b-row v-if="domainsStatistic && domainsStatistic.hasOwnProperty('tops')">
      <b-col
        xl="4"
        lg="6"
        class="mb-4"
      >
        <d-card class="card-small mb-4">
          <d-card-header class="border-bottom">
            <h6 class="m-0 text-center">
              بیشترین سقوط
            </h6>
          </d-card-header>

          <d-list-group flush>
            <d-list-group-item class="p-3">
              <b-table
                responsive="xl"
                :fields="fields"
                :items="domainsStatistic.tops.descent"
                thead-class="hidden_header"
                :borderless="true"
                style="text-align: left; direction: ltr"
              >
                <template
                  slot="id"
                  slot-scope="data"
                >
                  <img
                    width="16px"
                    height="16px"
                    onerror="this.src='/favicon.ico'"
                    :src="'http://'+data.item.domain+'/favicon.ico'"
                  >
                </template>
                <template v-slot:domain="data">
                  <a :href="'http://'+data.item.domain">{{ data.item.domain }}</a>
                </template>
                <template
                  slot="change"
                  slot-scope="data"
                >
                  <span class="text-danger">{{ data.item.change }}</span>
                </template>
              </b-table>
            </d-list-group-item>
          </d-list-group>
        </d-card>
      </b-col>

      <b-col
        xl="4"
        lg="6"
        class="mb-4"
      >
        <d-card class="card-small mb-4">
          <d-card-header class="border-bottom">
            <h6 class="m-0 text-center">
              با ثبات ترین
            </h6>
          </d-card-header>

          <d-list-group flush>
            <d-list-group-item class="p-3">
              <b-table
                responsive="xl"
                :fields="fields"
                :items="domainsStatistic.tops.stable"
                thead-class="hidden_header"
                :borderless="true"
                style="text-align: left; direction: ltr"
              >
                <template
                  slot="id"
                  slot-scope="data"
                >
                  <img
                    width="16px"
                    height="16px"
                    onerror="this.src='/favicon.ico'"
                    :src="'http://'+data.item.domain+'/favicon.ico'"
                  >
                </template>
                <template v-slot:domain="data">
                  <a :href="'http://'+data.item.domain">{{ data.item.domain }}</a>
                </template>
                <template
                  slot="change"
                  slot-scope="data"
                >
                  <span>{{ data.item.change }}</span>
                </template>
              </b-table>
            </d-list-group-item>
          </d-list-group>
        </d-card>
      </b-col>

      <b-col
        xl="4"
        lg="6"
        class="mb-4"
      >
        <d-card class="card-small mb-4">
          <d-card-header class="border-bottom">
            <h6 class="m-0 text-center">
              بیشترین سعود
            </h6>
          </d-card-header>

          <d-list-group flush>
            <d-list-group-item class="p-3">
              <b-table
                responsive="xl"
                :fields="fields"
                :items="domainsStatistic.tops.ascent"
                thead-class="hidden_header"
                :borderless="true"
                style="text-align: left; direction: ltr"
              >
                <template
                  slot="id"
                  slot-scope="data"
                >
                  <img
                    width="16px"
                    height="16px"
                    onerror="this.src='/favicon.ico'"
                    :src="'http://'+data.item.domain+'/favicon.ico'"
                  >
                </template>
                <template v-slot:domain="data">
                  <a :href="'http://'+data.item.domain">{{ data.item.domain }}</a>
                </template>
                <template
                  slot="change"
                  slot-scope="data"
                >
                  <span class="text-success">{{ data.item.change }}</span>
                </template>
              </b-table>
            </d-list-group-item>
          </d-list-group>
        </d-card>
      </b-col>
    </b-row>
  </d-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data () {
    return {
      topSites: [
        { key: 'icon', label: 'ایکن' },
        { key: 'name', label: 'نام' },
        { key: 'globalRank', label: 'رتبه' },
        { key: 'change', label: 'تغییرات' }
      ],
      fields: [
        { key: 'id', label: 'شناسه' },
        { key: 'domain', label: 'دامنه', class: 'cotted-columns' },
        { key: 'globalRank', label: 'رتبه جهانی' },
        { key: 'change', label: 'تغییرات' }
      ]
    }
  },

  computed: {
    ...mapGetters({
      domainsStatistic: 'statistics/domains/retrieved'
    })
  },

  created () {
    this.domainsStatisticLoad({ auth: true })
  },

  beforeDestroy () {
    this.reset()
  },

  methods: {
    ...mapActions({
      domainsStatisticLoad: 'statistics/domains/retrieve',
      domainsStatisticReset: 'statistics/domains/reset'
    }),

    reset () {
      this.domainsStatisticReset()
    }
  }
}
</script>

<style>
  .hidden_header {
    display: none;
  }

  .cotted-columns {
    max-width: 160px;
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
