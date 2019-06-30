<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col lg="12">
        <b-card>
          <b-row>
            <b-col md="9">
              <b-row>
                <b-col
                  md="6"
                  class="my-1"
                >
                  <b-form-group
                    horizontal
                    label="تاریخ انقضا از"
                    class="mb-0"
                  >
                    <date-picker
                      v-model="filters.expireAt.after"
                      :input-class="'form-control'"
                      display-format="dddd jDD jMMMM jYYYY HH:mm:ss"
                      type="datetime"
                      format="YYYY-MM-DD HH:mm:ss"
                      placeholder="تاریخ شروع را انتخاب نمایید"
                      :editable="true"
                    />
                  </b-form-group>
                </b-col>
                <b-col
                  md="6"
                  class="my-1"
                >
                  <b-form-group
                    horizontal
                    label="تاریخ انقضا تا"
                    class="mb-0"
                  >
                    <date-picker
                      v-model="filters.expireAt.before"
                      :input-class="'form-control'"
                      display-format="dddd jDD jMMMM jYYYY HH:mm:ss"
                      type="datetime"
                      format="YYYY-MM-DD HH:mm:ss"
                      placeholder="تاریخ پایان را انتخاب نمایید"
                      :editable="true"
                    />
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col
                  md="6"
                  class="my-1"
                >
                  <b-form-group
                    horizontal
                    label="دامنه"
                    class="mb-0"
                  >
                    <b-form-input v-model="filters['domain.domain']" />
                  </b-form-group>
                </b-col>
              </b-row>
            </b-col>
            <b-col
              md="3"
              class="nice-scrollbar"
              style="height: 100px;overflow-y: scroll;"
            >
              <b-form-checkbox-group
                stacked
                class="pr-3"
              >
                <div
                  v-for="field in fieldsList"
                  :key="field.key"
                  class="custom-control custom-checkbox"
                >
                  <input
                    :id="'fieldsList' + field.key"
                    v-model="field.checked"
                    type="checkbox"
                    class="custom-control-input"
                    :value="field.key"
                  >
                  <label
                    class="custom-control-label"
                    :for="'fieldsList' + field.key"
                  >{{ field.label }}</label>
                </div>
              </b-form-checkbox-group>
            </b-col>
          </b-row>
        </b-card>
        <b-card :title="'دامنه ها('+totalItems+' مورد)'">
          <div
            v-if="error"
            class="alert alert-danger"
          >
            {{ error }}
          </div>
          <b-table
            show-empty
            stacked="md"
            no-local-sorting
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :fields="fields"
            :hover="true"
            responsive="sm"
            :items="domainWatchers"
            :current-page="currentPage"
          >
            <template slot="empty">
              <div class="text-center">
                دامنه ای یافت نشد!
              </div>
            </template>
            <template
              slot="expireAt"
              slot-scope="data"
            >
              {{ (new Date(data.item.expireAt)).toLocaleDateString('fa-IR') }}
            </template>
            <template
              slot="domain"
              slot-scope="data"
            >
              <img
                width="16px"
                height="16px"
                onerror="this.src='/favicon.ico'"
                :src="'http://'+data.item.domain.domain+'/favicon.ico'"
              >
              <span>{{ data.item.domain.name }}</span>
            </template>
            <template
              slot="actions"
              slot-scope="data"
            >
              <router-link :to="{name: 'DomainShow', params: { domain: data.item.domain.domain }}">
                <span
                  class="fa fa-chart-line"
                  style="color: orange"
                  aria-hidden="true"
                />
              </router-link>
              <!--              <router-link :to="{name: 'DomainWatcherShow', params: { id: data.item['@id'] }}">-->
              <!--                <span class="fa fa-domainWatcher-circle text-info" aria-hidden="true" />-->
              <!--              </router-link>-->
            </template>
          </b-table>
          <nav v-if="view">
            <b-pagination
              v-model="currentPage"
              :total-rows="totalItems"
              :per-page="itemsPerPage"
              hide-goto-end-buttons
            />
          </nav>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import VuePersianDatetimePicker from 'vue-persian-datetime-picker'
import cloneDeep from 'lodash/cloneDeep'
import debounce from 'lodash/debounce'

export default {
  components: {
    datePicker: VuePersianDatetimePicker
  },

  data () {
    return {
      sortBy: 'expireAt',
      sortDesc: true,
      fields: [
      ],
      fieldsList: [
        {
          key: 'domain', label: 'دامنه', sortable: true, checked: true
        },
        {
          key: 'expireAt', label: 'تاریخ انقضا', sortable: true, checked: true
        },
        {
          key: 'history', label: 'تاریخچه', sortable: true, checked: true
        },
        { key: 'actions', label: 'عملیات', checked: true }
      ],
      filters: {
        expireAt: '',
        'domain.domain': ''
      },
      currentPage: 1,
      domainWatchers: [],
      lastQuery: ''
    }
  },

  computed: {
    ...mapGetters({
      error: 'domainWatcher/list/error',
      items: 'domainWatcher/list/items',
      isLoading: 'domainWatcher/list/isLoading',
      view: 'domainWatcher/list/view',
      totalItems: 'domainWatcher/list/totalItems',
      savedFieldsList: 'domainWatcher/list/fields'
    }),

    itemsPerPage () {
      return this.$remoteConfig.get('table.itemsPerPage', 30)
    }
  },

  watch: {
    currentPage () {
      this.pageLoad()
    },

    items (val) {
      this.domainWatchers = cloneDeep(val)
    },

    sortBy () {
      this.pageLoad()
    },

    sortDesc () {
      this.pageLoad()
    },

    fieldsList: {
      deep: true,
      handler (val) {
        this.setFields(cloneDeep(val))
        this.addFieldsToHeader()
      }
    },

    filters: {
      deep: true,
      handler: debounce(function () {
        this.pageLoad()
      }, 500)
    }
  },

  created () {
    if (this.savedFieldsList) {
      this.fieldsList = cloneDeep(this.savedFieldsList)
    }

    this.addFieldsToHeader()
    this.pageLoad()
  },

  beforeDestroy () {
    this.reset()
  },

  methods: {
    ...mapActions({
      getDomainWatchersList: 'domainWatcher/list/getItems',
      domainWatchersReset: 'domainWatcher/list/reset',
      setFields: 'domainWatcher/list/setFields'
    }),

    pageLoad () {
      const query = { page: this.currentPage }
      if (this.sortBy) {
        query.order = { [this.sortBy]: this.sortDesc ? 'DESC' : 'ASC' }
      }

      for (const filter in this.filters) {
        if (this.filters[filter].length > 0) {
          Object.assign(query, { [filter]: this.filters[filter] })
        }
      }

      if (this.lastQuery !== JSON.stringify(query)) {
        this.lastQuery = JSON.stringify(query)
        this.getDomainWatchersList({ query, progressBar: { request: 0, success: 100, fail: true } })
      }
    },

    addFieldsToHeader () {
      this.fields = []
      this.fieldsList.forEach((field) => {
        if (field.checked) {
          this.fields.push(field)
        }
      })
    },

    getBadge (status) {
      return status === 1 ? 'success' : 'secondary'
    },

    reset () {
      this.domainWatchersReset()
    }
  }
}
</script>
