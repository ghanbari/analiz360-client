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
            <b-col
              lg="6"
              sm="5"
            >
              <b-row>
                <b-col class="my-1">
                  <b-form-group
                    label="نام خانوادگی"
                    label-cols-lg="3"
                    class="mb-md-0 mb-sm-1"
                  >
                    <b-form-input v-model="filters.lastName" />
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col class="my-1">
                  <b-form-group
                    label="نام کاربری"
                    label-cols-lg="3"
                    class="mb-md-0 mb-sm-1"
                  >
                    <b-form-input v-model="filters.username" />
                  </b-form-group>
                </b-col>
              </b-row>
            </b-col>
            <b-col
              lg="5"
              sm="7"
              xs="12"
              class="my-auto"
            >
              <b-row>
                <b-col xs="6">
                  <fieldset>
                    <b-form-checkbox-group
                      class="pr-3"
                      stacked
                    >
                      <div
                        v-for="field in fieldsList.slice(0, 5)"
                        :key="field.key"
                        class="custom-control custom-checkbox"
                      >
                        <input
                          :id="'fieldsList' + field.key"
                          :key="field.key"
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
                  </fieldset>
                </b-col>
                <b-col xs="6">
                  <fieldset>
                    <b-form-checkbox-group
                      class="pr-3"
                      stacked
                    >
                      <div
                        v-for="field in fieldsList.slice(5)"
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
                  </fieldset>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <b-card>
          <b-card-title>{{ 'کاربران('+totalItems+' مورد)' }}</b-card-title>
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
            :items="users"
            :current-page="currentPage"
          >
            <template
              slot="createdAt"
              slot-scope="data"
            >
              {{ (new Date(data.item.createdAt)).toLocaleDateString('fa-IR') }}
            </template>
            <template slot="empty">
              <div class="text-center">
                کاربری یافت نشد!
              </div>
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
              slot="actions"
              slot-scope="data"
            >
              <router-link :to="{name: 'UserUpdate', params: { id: data.item['@id'] }}">
                <span
                  class="icon-pencil"
                  style="color: orange"
                  aria-hidden="true"
                />
              </router-link>
              <router-link :to="{name: 'UserShow', params: { id: data.item['@id'] }}">
                <span
                  class="icon-user text-info"
                  aria-hidden="true"
                />
              </router-link>
              <router-link :to="{name: 'WalletList', query: { user: data.item['id'] }}">
                <span
                  class="icon-wallet text-success"
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
          key: 'firstName', label: 'نام', sortable: true, checked: true
        },
        {
          key: 'lastName', label: 'نام خانوادگی', sortable: true, checked: true
        },
        {
          key: 'username', label: 'نام کاربری', sortable: true, checked: true
        },
        {
          key: 'email', label: 'پست الکترونیک', sortable: true, checked: false
        },
        {
          key: 'phone', label: 'همراه', sortable: true, checked: false
        },
        {
          key: 'createdAt', label: 'ثبت نام', sortable: true, checked: true
        },
        {
          key: 'status', label: 'فعال؟', sortable: true, checked: true, class: 'text-center'
        },
        { key: 'actions', label: 'عملیات', checked: true }
      ],
      filters: {
        lastName: '',
        username: ''
      },
      currentPage: 1,
      users: [],
      lastQuery: ''
    }
  },

  computed: {
    ...mapGetters({
      error: 'user/list/error',
      items: 'user/list/items',
      isLoading: 'user/list/isLoading',
      view: 'user/list/view',
      totalItems: 'user/list/totalItems',
      savedFieldsList: 'user/list/fields'
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
      this.users = cloneDeep(val)
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
      getUsersList: 'user/list/getItems',
      usersReset: 'user/list/reset',
      setFields: 'user/list/setFields'
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
        this.getUsersList({ query, progressBar: { request: 0, success: 100, fail: true } })
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
      this.usersReset()
    }
  }
}
</script>
