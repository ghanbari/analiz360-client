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
                    label="تاریخ شروع"
                    class="mb-0"
                  >
                    <date-picker
                      v-model="filters.startAt.after"
                      :input-class="'form-control'"
                      display-format="dddd jDD jMMMM jYYYY HH:mm:ss"
                      type="datetime"
                      format="YYYY-MM-DD HH:mm:ss"
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
                      v-model="filters.expireAt.before"
                      :input-class="'form-control'"
                      display-format="dddd jDD jMMMM jYYYY HH:mm:ss"
                      type="datetime"
                      format="YYYY-MM-DD HH:mm:ss"
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
                    label="نوع پیام"
                    class="mb-0"
                  >
                    <b-form-select
                      v-model="filters.messageType"
                      :options="messageTypeOptions"
                    />
                  </b-form-group>
                </b-col>
                <b-col
                  md="6"
                  class="my-1"
                >
                  <b-form-group
                    horizontal
                    label="نوع تاریخ"
                    class="mb-0"
                  >
                    <b-form-select
                      v-model="filters.dateType"
                      :options="dateTypeOptions"
                    />
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row v-if="filters.messageType">
                <b-col
                  md="6"
                  class="my-1"
                >
                  <b-form-group
                    horizontal
                    label="پیام"
                    class="mb-0"
                  >
                    <b-form-input
                      v-model="filters.text"
                      placeholder="برای جستجو بخشی از متن پیام را وارد نمایید"
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
          <b-card-title>{{ 'پیام های زماندار('+totalItems+' مورد)' }}</b-card-title>
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
                الگویی یافت نشد!
              </div>
            </template>
            <template
              slot="messageType"
              slot-scope="data"
            >
              <span :class="['fa', data.item.messageType === 'email' ? 'fa-at' : 'fa-envelope']" />
            </template>
            <template
              slot="date"
              slot-scope="data"
            >
              <template v-if="data.item.dateType === 1">
                <div
                  v-for="(date, index) in data.item.dates.datetimes"
                  :key="index"
                >
                  {{ (new Date(date)).toLocaleString("fa-IR") }}
                </div>
              </template>
              <template v-if="data.item.dateType === 2">
                <template v-if="data.item.dates.hasOwnProperty('weekday')">
                  <div
                    v-for="weekday in data.item.dates.weekday"
                    :key="weekday"
                  >
                    هر {{ weekday }}<span v-if="data.item.dates.time"> در ساعت {{ data.item.dates.time }}</span>
                  </div>
                </template>
                <template v-if="data.item.dates.hasOwnProperty('monthday')">
                  <div
                    v-for="monthday in data.item.dates.monthday"
                    :key="monthday"
                  >
                    {{ monthday }} ام هر ماه<span v-if="data.item.dates.time"> ساعت {{ data.item.dates.time }}</span>
                  </div>
                </template>
                <template v-if="data.item.dates.hasOwnProperty('daily')">
                  هر {{ data.item.dates.daily }} روز<span v-if="data.item.dates.time"> در ساعت {{ data.item.dates.time }}</span>
                </template>
              </template>
              <template v-if="data.item.dateType === 3">
                <div
                  v-for="(date, index) in data.item.dates.days"
                  :key="index"
                >
                  {{ date.day }} روز {{ date.next ? 'بعد' : 'قبل' }}
                  <span v-if="date.time"> ساعت {{ date.time }}</span>
                </div>
              </template>
              <template v-if="data.item.dateType === 4">
                <div
                  v-for="(date, index) in data.item.dates.days"
                  :key="index"
                >
                  {{ date.day }} روز بعد
                  <span v-if="date.time"> ساعت {{ date.time }}</span>
                </div>
              </template>
            </template>
            <template
              slot="dateType"
              slot-scope="data"
            >
              {{
                data.item.dateType === 1 ? 'ثابت' :
                data.item.dateType === 2 ? 'تکرارپذیر' :
                data.item.dateType === 3 ? 'تولد' : 'ثبت نام' }}
            </template>
            <template
              slot="expired"
              slot-scope="data"
            >
              <b-badge :variant="data.item.expired ? 'danger' : 'success'">
                <span :class="['fa', data.item.expired ? 'fa-check' : 'fa-close']" />
              </b-badge>
            </template>
            <template
              slot="startAt"
              slot-scope="data"
            >
              {{ data.item.startAt ? (new Date(data.item.startAt)).toLocaleDateString("fa-IR") : '' }}
            </template>
            <template
              slot="expireAt"
              slot-scope="data"
            >
              {{ data.item.expireAt ? (new Date(data.item.expireAt)).toLocaleDateString("fa-IR") : 'نامحدود' }}
            </template>
            <template
              slot="usageCount"
              slot-scope="data"
            >
              <b-progress
                style="background-color: green"
                variant="danger"
                :striped="true"
                :value="data.item.usageCount"
                :max="data.item.maxUsageCount"
                :precision="2"
                show-progress
                class="mb-2"
              />
            </template>
            <template
              slot="actions"
              slot-scope="data"
            >
              <router-link :to="{name: 'ScheduledMessageUpdate', params: { id: data.item['@id'] }}">
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
          key: 'messageType', label: 'نوع', sortable: true, checked: true
        },
        {
          key: 'date', label: 'تاریخ', sortable: false, checked: true
        },
        {
          key: 'dateType', label: 'نوع تاریخ', sortable: false, checked: true
        },
        {
          key: 'startAt', label: 'شروع', sortable: true, checked: true
        },
        {
          key: 'expireAt', label: 'انقضا', sortable: true, checked: true
        },
        {
          key: 'expired', label: 'منقضی؟', sortable: true, checked: true, class: 'text-center'
        },
        {
          key: 'usageCount', label: 'استفاده', sortable: true, checked: true
        },

        {
          key: 'template.name', label: 'قالب', sortable: false, checked: false
        },
        {
          key: 'message', label: 'پیام', sortable: false, checked: false
        },
        {
          key: 'priority', label: 'الویت', sortable: false, checked: false
        },
        {
          key: 'maxTryCount', label: 'حداکثر تلاش', sortable: false, checked: false
        },
        {
          key: 'timeout', label: 'وقفه', sortable: false, checked: false
        },
        {
          key: 'senderEmail', label: 'فرستنده', sortable: false, checked: false
        },
        {
          key: 'provider', label: 'ارسال کننده', sortable: false, checked: false
        },

        {
          key: 'actions', label: 'ویرایش؟', sortable: false, checked: true, class: 'text-center'
        }
      ],
      filters: {
        startAt: { after: '' },
        expireAt: { before: '' },
        text: '',
        messageType: 0,
        dateType: 0
      },
      currentPage: 1,
      messages: [],
      lastQuery: '',
      messageTypeOptions: [
        { text: 'برای جست و جو متن پیام، یک گزینه انتخاب نمایید', disabled: true, value: 0 },
        { text: 'پیامک', value: 'sms' },
        { text: 'پست الکترونیک', value: 'email' }
      ],
      dateTypeOptions: [
        { text: 'لطفا یک گزینه انتخاب نمایید', disabled: true, value: 0 },
        { text: 'ثابت', value: 1 },
        { text: 'تکرارشونده', value: 2 },
        { text: 'تولد', value: 3 },
        { text: 'ثبت نام', value: 4 }
      ]
    }
  },

  computed: {
    ...mapGetters({
      error: 'scheduledMessage/list/error',
      items: 'scheduledMessage/list/items',
      isLoading: 'scheduledMessage/list/isLoading',
      view: 'scheduledMessage/list/view',
      totalItems: 'scheduledMessage/list/totalItems',
      deletedItem: 'scheduledMessage/del/deleted',
      messageDeleteError: 'scheduledMessage/del/error',
      savedFieldsList: 'scheduledMessage/list/fields'
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
      this.$toasted.success('پیام با موفقیت حذف شد.', { icon: 'icon-attention-alat' })
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
      getPage: 'scheduledMessage/list/getItems',
      pageReset: 'scheduledMessage/list/reset',
      messageRemoveFromList: 'scheduledMessage/list/removeItem',
      messageDelete: 'scheduledMessage/del/del',
      messageDeleteReset: 'scheduledMessage/del/reset',
      setFields: 'scheduledMessage/list/setFields'
    }),

    pageLoad () {
      const query = { page: this.currentPage }
      if (this.sortBy) {
        query.order = { [this.sortBy]: this.sortDesc ? 'DESC' : 'ASC' }
      }

      for (const filter in this.filters) {
        if (this.filters[filter]) {
          if (filter === 'startAt') {
            if (this.filters.startAt.after && this.filters.startAt.after !== 'null') {
              Object.assign(query, { startAt: { after: this.filters.startAt.after } })
            }
          } else if (filter === 'expireAt') {
            if (this.filters.expireAt.before && this.filters.expireAt.before !== 'null') {
              Object.assign(query, { expireAt: { before: this.filters.expireAt.before } })
            }
          } else {
            Object.assign(query, { [filter]: this.filters[filter] })
          }
        }
      }

      if (query.hasOwnProperty('text')) {
        const prop = this.filters.messageType === 'sms' ? 'message' : 'template.template'
        Object.assign(query, { [prop]: this.filters.text })
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

    reset () {
      this.pageReset()
    }
  }
}
</script>
