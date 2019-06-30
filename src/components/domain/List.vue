<template>
  <d-container
    fluid
    class="main-content-container px-4 py-5"
  >
    <b-row>
      <b-col
        lg="12"
        class="mb-4"
      >
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
                    label="نام"
                    class="mb-0"
                  >
                    <b-form-input v-model="filters.name" />
                  </b-form-group>
                </b-col>
                <b-col
                  md="6"
                  class="my-1"
                >
                  <b-form-group
                    horizontal
                    label="دامنه"
                    class="mb-0"
                  >
                    <b-form-input v-model="filters.domain" />
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
                    label="تاریخ ثبت از"
                    class="mb-0"
                  >
                    <date-picker
                      v-model="filters.registrationDate.after"
                      :input-class="'form-control'"
                      display-format="dddd jDD jMMMM jYYYY HH:mm:ss"
                      type="date"
                      format="YYYY-MM-DD"
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
                    label="تاریخ ثبت تا"
                    class="mb-0"
                  >
                    <date-picker
                      v-model="filters.registrationDate.before"
                      :input-class="'form-control'"
                      display-format="dddd jDD jMMMM jYYYY HH:mm:ss"
                      type="date"
                      format="YYYY-MM-DD"
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
                    label="وضعیت"
                    class="mb-0"
                  >
                    <b-form-select
                      v-model="filters.status"
                      :options="[{text: 'فعال', value: 1},{text: 'غیرفعال', value: 0},{text: 'موقتا غیرفعال', value: 2}]"
                    />
                  </b-form-group>
                </b-col>
                <b-col
                  md="6"
                  class="my-1"
                >
                  <b-form-group
                    horizontal
                    label="وضعیت گزارشات"
                    class="mb-0"
                  >
                    <b-form-select
                      v-model="filters.lastReportStatus"
                      :options="[{text: 'نامشخص', value: ''},{text: 'خطا', value: -1},{text: 'در حال پردازش', value: 1},{text: 'انجام شده', value: 2}]"
                    />
                  </b-form-group>
                </b-col>
              </b-row>
            </b-col>
            <b-col
              md="3"
              class="nice-scrollbar"
              style="height: 150px;overflow-y: scroll;"
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
      </b-col>
    </b-row>
    <b-row>
      <b-col
        lg="12"
        class="mb-4"
      >
        <b-card>
          <b-card-title><span class="fa fa-globe" />دامنه({{ totalItems }}) مورد</b-card-title>
          <b-card-sub-title>&nbsp;</b-card-sub-title>

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
            :items="domains"
            :current-page="currentPage"
          >
            <template slot="empty">
              <div class="text-center">
                دامنه ای یافت نشد!
              </div>
            </template>
            <template
              slot="registrationDate"
              slot-scope="data"
            >
              {{ (new Date(data.item.registrationDate)).toLocaleDateString('fa-IR') }}
            </template>
            <template
              v-if="data.item.registerBy"
              slot="registerBy"
              slot-scope="data"
            >
              <router-link :to="{name: 'UserShow', params: {id: data.item.registerBy['@id']}}">
                <a>{{ data.item.registerBy.firstName }} {{ data.item.registerBy.lastName }}</a>
              </router-link>
            </template>
            <template
              v-if="data.item.owner"
              slot="owner"
              slot-scope="data"
            >
              <router-link :to="{name: 'UserShow', params: {id: data.item.owner['@id']}}">
                <a>{{ data.item.owner.firstName }} {{ data.item.owner.lastName }}</a>
              </router-link>
            </template>
            <template
              slot="status"
              slot-scope="data"
            >
              <span
                class="fa"
                :class="[data.item.status ? 'fa-check-circle' : 'fa-times-circle', 'text-'+getBadge(data.item.status)]"
                style="font-size: 20px;"
              />
            </template>
            <template
              v-if="data.item.lastReportStatus"
              slot="lastReportStatus"
              slot-scope="data"
            >
              <span
                class="fa"
                :class="[data.item.lastReportStatus === 2 ? 'fa-check-circle' : (data.item.lastReportStatus === 1 ? 'fa-spinner' : 'fa-times-circle'), 'text-'+(data.item.lastReportStatus === 2 ? 'success' : (data.item.lastReportStatus === 1 ? 'warning' : 'danger'))]"
                style="font-size: 20px;"
              />
            </template>
            <template
              v-if="data.item.lastReportAt"
              slot="lastReportAt"
              slot-scope="data"
            >
              {{ (new Date(data.item.lastReportAt)).toLocaleString('fa-IR') }}
            </template>
            <template
              slot="actions"
              slot-scope="data"
            >
              <router-link :to="{name: 'DomainUpdate', params: { id: data.item['@id'] }}">
                <span
                  class="icon-pencil"
                  style="color: orange"
                  aria-hidden="true"
                />
              </router-link>
              <router-link :to="{name: 'DomainShow', params: { domain: data.item.domain }}">
                <span
                  class="icon-globe text-info"
                  aria-hidden="true"
                />
              </router-link>
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
  </d-container>
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
      sortBy: 'id',
      sortDesc: false,
      fields: [
      ],
      fieldsList: [
        {
          key: 'id', label: 'شناسه', sortable: true, checked: true
        },
        {
          key: 'name', label: 'نام', sortable: true, checked: true
        },
        {
          key: 'domain', label: 'دامنه', sortable: true, checked: true
        },
        {
          key: 'registrationDate', label: 'تاریخ ثبت', sortable: true, checked: true
        },
        {
          key: 'registerBy', label: 'ثبت کننده', sortable: false, checked: false
        },
        {
          key: 'status', label: 'وضعیت', sortable: true, checked: false
        },
        {
          key: 'owner', label: 'مالک', sortable: false, checked: true
        },
        {
          key: 'lastReportStatus', label: 'وضعیت گزارشات', sortable: true, checked: true, class: 'text-center'
        },
        {
          key: 'lastReportAt', label: 'تاریخ اخرین گزارش', sortable: true, checked: true, class: 'text-center'
        },
        { key: 'actions', label: 'عملیات', checked: true }
      ],
      filters: {
        name: '',
        domain: '',
        registrationDate: { after: '', before: '' },
        status: 1,
        lastReportStatus: 2
      },
      currentPage: 1,
      domains: [],
      lastQuery: ''
    }
  },

  computed: {
    ...mapGetters({
      error: 'domain/list/error',
      items: 'domain/list/items',
      isLoading: 'domain/list/isLoading',
      view: 'domain/list/view',
      totalItems: 'domain/list/totalItems',
      savedFieldsList: 'domain/list/fields'
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
      this.domains = cloneDeep(val)
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
      getDomainsList: 'domain/list/getItems',
      domainsReset: 'domain/list/reset',
      setFields: 'domain/list/setFields'
    }),

    pageLoad () {
      const query = { page: this.currentPage }
      if (this.sortBy) {
        query.order = { [this.sortBy]: this.sortDesc ? 'DESC' : 'ASC' }
      }

      for (const filter in this.filters) {
        if (filter === 'registrationDate') {
          const registrationDate = {}
          if (this.filters[filter].before) {
            registrationDate.before = this.filters[filter].before
          }

          if (this.filters[filter].after) {
            registrationDate.after = this.filters[filter].after
          }

          if (Object.keys(registrationDate).length) {
            Object.assign(query, { registrationDate })
          }
        } else if (this.filters[filter]) {
          Object.assign(query, { [filter]: this.filters[filter] })
        }
      }

      if (this.lastQuery !== JSON.stringify(query)) {
        this.lastQuery = JSON.stringify(query)
        this.getDomainsList({ query, progressBar: { request: 0, success: 100, fail: true } })
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
      return status === 1 ? 'success'
        : status === 2 ? 'warning' : 'secondary'
    },

    reset () {
      this.domainsReset()
    }
  }
}
</script>
