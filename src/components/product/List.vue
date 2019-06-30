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
                      v-model="filters.visibleFrom.after"
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
                    label="تاریخ پایان"
                    class="mb-0"
                  >
                    <date-picker
                      v-model="filters.visibleTill.before"
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
                    label="واحد پولی"
                    class="mb-0"
                  >
                    <b-form-select
                      v-model="filters.unit"
                      :options="[{text: 'واحد پولی', value: ''}, {text: 'ریال', value: 1},{text: 'لیز', value: 2}]"
                    />
                  </b-form-group>
                </b-col>
                <b-col
                  md="6"
                  class="my-1"
                >
                  <b-form-group
                    horizontal
                    label="نوع محصول"
                    class="mb-0"
                  >
                    <b-form-select
                      v-model="filters.type"
                      :options="[{text: 'نوع محصول', value: ''}, {text: 'بسته لیز', value: 1},{text: 'افزودن دامنه', value: 2},{text: 'مانیتور دامنه', value: 3},{text: 'افزایش محدودیت رایگان', value: 4}]"
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
                    label="نام"
                    class="mb-0"
                  >
                    <b-form-input v-model="filters.title" />
                  </b-form-group>
                </b-col>
                <b-col
                  md="6"
                  class="my-1"
                >
                  <b-form-group
                    horizontal
                    label="فعال؟"
                    class="mb-0"
                  >
                    <b-form-select
                      v-model="filters.active"
                      :options="[{text: 'وضعیت محصول را انتخاب نمایید', value: ''}, {text: 'فعال', value: 1},{text: 'غیرفعال', value: 0}]"
                    />
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
      </b-col>
    </b-row>
    <b-row>
      <b-col
        lg="12"
        class="mb-4"
      >
        <b-card
          :title="'محصولات('+totalItems+' مورد)'"
          sub-title=""
        >
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
            :items="products"
            :current-page="currentPage"
          >
            <template slot="empty">
              <div class="text-center">
                محصولی یافت نشد!
              </div>
            </template>
            <template
              slot="unit"
              slot-scope="data"
            >
              {{ data.item.unit == 1 ? 'ریال' : 'لیز' }}
            </template>
            <template
              slot="type"
              slot-scope="data"
            >
              {{ getTypeName(data.item.type) }}
            </template>
            <template
              slot="visibleFrom"
              slot-scope="data"
            >
              <span v-if="data.item.visibleFrom">{{ (new Date(data.item.visibleFrom)).toLocaleDateString('fa-IR') }}</span>
            </template>
            <template
              slot="visibleTill"
              slot-scope="data"
            >
              <span v-if="data.item.visibleTill">{{ (new Date(data.item.visibleTill)).toLocaleDateString('fa-IR') }}</span>
            </template>
            <template
              slot="active"
              slot-scope="data"
            >
              <span
                class="fa"
                :class="[data.item.active ? 'fa-check-circle' : 'fa-times-circle', 'text-'+getBadge(data.item.active)]"
                style="font-size: 20px;"
              />
            </template>
            <template
              slot="actions"
              slot-scope="data"
            >
              <router-link :to="{name: 'ProductUpdate', params: { id: data.item['@id'] }}">
                <span
                  class="icon-pencil"
                  style="color: orange"
                  aria-hidden="true"
                />
              </router-link>
              <router-link :to="{name: 'ProductShow', params: { id: data.item['@id'] }}">
                <span
                  class="icon-product-hunt text-info"
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
          key: 'price', label: 'قیمت', sortable: true, checked: true
        },
        {
          key: 'unit', label: 'واحد', sortable: true, checked: true
        },
        {
          key: 'type', label: 'نوع', sortable: true, checked: true
        },
        {
          key: 'title', label: 'عنوان', sortable: true, checked: false
        },
        {
          key: 'visibleFrom', label: 'تاریخ شروع', sortable: true, checked: true
        },
        {
          key: 'visibleTill', label: 'تاریخ انقضا', sortable: true, checked: true
        },
        {
          key: 'active', label: 'فعال؟', sortable: true, checked: true, class: 'text-center'
        },
        { key: 'actions', label: 'عملیات', checked: true }
      ],
      filters: {
        unit: '',
        type: '',
        title: '',
        visibleFrom: { after: '' },
        visibleTill: { before: '' },
        active: ''
      },
      currentPage: 1,
      products: [],
      lastQuery: ''
    }
  },

  computed: {
    ...mapGetters({
      error: 'product/list/error',
      items: 'product/list/items',
      isLoading: 'product/list/isLoading',
      view: 'product/list/view',
      totalItems: 'product/list/totalItems',
      savedFieldsList: 'product/list/fields'
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
      this.products = cloneDeep(val)
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
      getProductsList: 'product/list/getItems',
      productsReset: 'product/list/reset',
      setFields: 'product/list/setFields'
    }),

    getTypeName (val) {
      return val === 1 ? 'بسته لیز'
        : val === 2 ? 'افزودن سایت'
          : val === 3 ? 'مانیتورینگ دامنه' : 'افزایش محدودیت رایگان'
    },

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
        this.getProductsList({ query, progressBar: { request: 0, success: 100, fail: true } })
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
      return status ? 'success' : 'secondary'
    },

    reset () {
      this.productsReset()
    }
  }
}
</script>
