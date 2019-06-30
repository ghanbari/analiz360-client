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
                    label="پیام"
                    class="mb-0"
                  >
                    <b-form-input v-model="filters.message" />
                  </b-form-group>
                </b-col>
                <b-col
                  md="6"
                  class="my-1"
                >
                  <b-form-group
                    horizontal
                    label="شماره گیرنده"
                    class="mb-0"
                  >
                    <b-form-input v-model="filters.receptor" />
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
                    label="تاریخ شروع"
                    class="mb-0"
                  >
                    <date-picker
                      v-model="filters.time.after"
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
                    label="تاریخ پایان"
                    class="mb-0"
                  >
                    <date-picker
                      v-model="filters.time.before"
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
                    label="وضعیت"
                    class="mb-0"
                  >
                    <b-form-select
                      v-model="filters.status"
                      :options="statusOptions"
                    />
                  </b-form-group>
                </b-col>
              </b-row>
            </b-col>
            <b-col
              md="3"
              class="nice-scrollbar"
              style="height: 140px;overflow-y: scroll;"
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
          <b-card-title>{{ 'پیامک ها('+totalItems+' مورد)' }}</b-card-title>
          <b-card-sub-title>&nbsp;</b-card-sub-title>
          <b-table
            show-empty
            stacked="md"
            no-local-sorting
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :fields="fields"
            :hover="true"
            responsive="sm"
            :items="messages"
            :current-page="currentPage"
          >
            <template slot="empty">
              <div class="text-center">
                پیامی یافت نشد!
              </div>
            </template>
            <template
              slot="time"
              slot-scope="data"
            >
              {{ (new Date(data.item.time)).toLocaleString('fa-IR') }}
            </template>
            <template
              slot="status"
              slot-scope="data"
            >
              <b-badge :variant="getBadge(data.item.status)">
                {{ getStatus(data.item.status) }}
              </b-badge>
            </template>
            <template
              slot="actions"
              slot-scope="data"
            >
              <router-link :to="{name: 'SmsMessageUpdate', params: { id: data.item['@id'] }}">
                <span
                  class="icon-pencil"
                  style="color: orange"
                  aria-hidden="true"
                />
              </router-link>
              <span
                class="icon-trash text-danger"
                aria-hidden="true"
                style="cursor: pointer"
                @click="remove(data.item)"
              />
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
          key: 'time', label: 'زمان', sortable: true, checked: true
        },
        {
          key: 'message', label: 'پیام', sortable: false, checked: true
        },
        {
          key: 'receptor', label: 'گیرنده', sortable: true, checked: true
        },
        {
          key: 'priority', label: 'الویت', sortable: true, checked: true
        },
        {
          key: 'status', label: 'وضعیت', sortable: true, checked: true
        },
        {
          key: 'maxTryCount', label: 'حداکثر تلاش', sortable: true, checked: false
        },
        {
          key: 'timeout', label: 'وقفه', sortable: true, checked: false
        },
        {
          key: 'provider', label: 'ارسال کننده', sortable: true, checked: false
        },
        { key: 'actions', label: 'عملیات', checked: true }
      ],
      filters: {
        message: '',
        receptor: '',
        time: { after: '', before: '' },
        status: 0
      },
      currentPage: 1,
      messages: [],
      lastQuery: '',
      statusOptions: [
        { text: 'برای جستجو یک گزینه را انتخاب نمایید', value: 0, disabled: true },
        { text: 'آماده سازی', value: 0 },
        { text: 'صف داخلی', value: 5 },
        { text: 'صف ارسال کننده', value: 10 },
        { text: 'زمانبندی شده', value: 15 },
        { text: 'ارسال به مخابرات', value: 20 },
        { text: 'تحویل نشده', value: 25 },
        { text: 'تحویل شده', value: 30 },
        { text: 'بلاک شده', value: 35 }
      ]
    }
  },

  computed: {
    ...mapGetters({
      error: 'smsMessage/list/error',
      items: 'smsMessage/list/items',
      isLoading: 'smsMessage/list/isLoading',
      view: 'smsMessage/list/view',
      totalItems: 'smsMessage/list/totalItems',
      deletedItem: 'smsMessage/del/deleted',
      messageDeleteError: 'smsMessage/del/error',
      savedFieldsList: 'smsMessage/list/fields'
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
      this.messages = cloneDeep(val)
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
    },

    deletedItem (item) {
      this.$toasted.success('پیام با موفقیت حذف شد.', { icon: 'icon-attention-alt' })
      this.messageRemoveFromList(item)
      if (this.messages.indexOf(item) > -1) {
        this.messages.splice(this.messages.indexOf(item), 1)
      }
    },

    error (val) {
      if (val) {
        this.$toasted.error(val, { icon: 'icon-attention' })
      }
    },

    messageDeleteError (val) {
      if (val) {
        this.$toasted.error(val, { icon: 'icon-attention' })
      }
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
      getPage: 'smsMessage/list/getItems',
      messageReset: 'smsMessage/list/reset',
      messageRemoveFromList: 'smsMessage/list/removeItem',
      messageDelete: 'smsMessage/del/del',
      messageDeleteReset: 'smsMessage/del/reset',
      setFields: 'smsMessage/list/setFields'
    }),

    pageLoad () {
      const query = { page: this.currentPage }
      if (this.sortBy) {
        query.order = { [this.sortBy]: this.sortDesc ? 'DESC' : 'ASC' }
      }

      for (const filter in this.filters) {
        if (filter === 'time') {
          const time = {}
          if (this.filters[filter].before) {
            time.before = this.filters[filter].before
          }

          if (this.filters[filter].after) {
            time.after = this.filters[filter].after
          }

          if (Object.keys(time).length) {
            Object.assign(query, { time })
          }
        } else if (this.filters[filter]) {
          Object.assign(query, { [filter]: this.filters[filter] })
        }
      }

      if (this.lastQuery !== JSON.stringify(query)) {
        this.lastQuery = JSON.stringify(query)
        this.getPage({ query, progressBar: { request: 0, success: 100, fail: true } })
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

    remove (item) {
      this.messageDeleteReset()
      if (confirm('آیا نسبت به حذف این پیامک مطمین هستید؟')) {
        this.messageDelete(item)
      }
    },

    getBadge (status) {
      return status === 0 ? 'info'
        : status === 5 ? 'info'
          : status === 10 ? 'info'
            : status === 15 ? 'info'
              : status === 20 ? 'info'
                : status === 25 ? 'warning'
                  : status === 30 ? 'success'
                    : status === 35 ? 'danger' : 'secondary'
    },

    getStatus (status) {
      return status === 0 ? 'آماده سازی'
        : status === 5 ? 'صف داخلی'
          : status === 10 ? 'صف ارسال کننده'
            : status === 15 ? 'زمانبندی شده'
              : status === 20 ? 'ارسال به مخابرات'
                : status === 25 ? 'تحویل نشده'
                  : status === 30 ? 'تحویل شده'
                    : status === 35 ? 'بلاک شده' : 'نا مشخص'
    },

    reset () {
      this.messageReset()
      this.messageDeleteReset()
      this.$toasted.clear()
    }
  }
}
</script>
