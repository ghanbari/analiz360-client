<template>
  <d-container
    fluid
    class="main-content-container px-4"
  >
    <b-row>
      <b-col class="py-4">
        <b-card>
          <b-row>
            <b-col
              md="12"
              class="nice-scrollbar"
            >
              <b-form-checkbox-group class="pr-3">
                <div
                  v-for="field in fieldsList"
                  :key="field.key"
                  class="custom-control custom-checkbox custom-control-inline mr-4"
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
      <b-col class="pb-5">
        <b-card no-body>
          <b-card-title class="p-3">
            تراکنش ها({{ totalItems }} مورد)
          </b-card-title>
          <b-card-sub-title>&nbsp;</b-card-sub-title>

          <b-card-body class="p-0 pb-3 text-center">
            <div
              v-if="error"
              class="alert alert-danger p-3"
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
              :items="wallets"
              :current-page="currentPage"
            >
              <template slot="empty">
                <div class="text-center">
                  تراکنشی یافت نشد!
                </div>
              </template>
              <template
                slot="unit"
                slot-scope="data"
              >
                <span v-if="data.item.unit === 1">ریال</span>
                <span v-else>لیز</span>
              </template>
              <template
                slot="type"
                slot-scope="data"
              >
                <span v-if="data.item.unit === 1">واریز</span>
                <span v-else>برداشت</span>
              </template>
              <template
                slot="createdAt"
                slot-scope="data"
              >
                {{ (new Date(data.item.createdAt)).toLocaleString('fa-IR') }}
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
            </b-table>
            <nav
              v-if="view"
              class="p-3"
            >
              <b-pagination
                v-model="currentPage"
                :total-rows="totalItems"
                :per-page="itemsPerPage"
                hide-goto-end-buttons
              />
            </nav>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </d-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import debounce from 'lodash/debounce'

export default {
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
          key: 'amount', label: 'مقدار', sortable: true, checked: true
        },
        {
          key: 'unit', label: 'واحد پولی', sortable: true, checked: true
        },
        {
          key: 'type', label: 'نوع', sortable: true, checked: true
        },
        {
          key: 'status', label: 'وضعیت', sortable: true, checked: false
        },
        {
          key: 'createdAt', label: 'تاریخ', sortable: true, checked: true
        },
        {
          key: 'description', label: 'توضیحات', sortable: false, checked: true
        },
        {
          key: 'box', label: 'باکس', sortable: false, checked: false
        },
        {
          key: 'voucher', label: 'کد تخفیف', sortable: false, checked: false
        }
      ],
      currentPage: 1,
      wallets: [],
      lastQuery: ''
    }
  },

  computed: {
    filters () {
      return {
        owner: this.$route.query.user
      }
    },
    ...mapGetters({
      error: 'wallet/list/error',
      items: 'wallet/list/items',
      isLoading: 'wallet/list/isLoading',
      view: 'wallet/list/view',
      totalItems: 'wallet/list/totalItems',
      savedFieldsList: 'wallet/list/fields'
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
      this.wallets = cloneDeep(val)
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
      getWalletsList: 'wallet/list/getItems',
      walletsReset: 'wallet/list/reset',
      setFields: 'wallet/list/setFields'
    }),

    pageLoad () {
      const query = { page: this.currentPage }
      if (this.sortBy) {
        query.order = { [this.sortBy]: this.sortDesc ? 'DESC' : 'ASC' }
      }

      for (const filter in this.filters) {
        if (this.filters[filter] !== undefined) {
          Object.assign(query, { [filter]: this.filters[filter] })
        }
      }

      if (this.lastQuery !== JSON.stringify(query)) {
        this.lastQuery = JSON.stringify(query)
        this.getWalletsList({ query, progressBar: { request: 0, success: 100, fail: true } })
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
      this.walletsReset()
    }
  }
}
</script>
