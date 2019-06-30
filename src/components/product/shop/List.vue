<template>
  <d-container
    fluid
    class="main-content-container"
  >
    <b-row>
      <b-col
        lg="12"
        :class="[theme === 'large' ? '' : 'px-0']"
      >
        <b-card-group
          deck
          :class="['products', theme === 'large' ? 'py-4 px-3' : 'px-0']"
        >
          <template v-if="theme === 'large'">
            <b-card
              v-for="product in products"
              :key="product.id"
              :title="product.title"
              :sub-title="new Intl.NumberFormat('fa-IR').format(product.price) + ' ریال'"
              :img-src="product.imagePath"
              :img-alt="product.title"
              img-top
              tag="article"
              style="max-width: 22rem;"
              class="product box-large mb-2"
            >
              <router-link :to="{name: 'OrderCreate', query: {product: product['@id']}}">
                <b-button variant="success">
                  خرید
                </b-button>
              </router-link>
            </b-card>
          </template>
          <template v-if="theme === 'small'">
            <b-card
              v-for="product in products"
              :key="product.id"
              :img-src="product.imagePath && product.imagePath.replace('product_large', 'product_small')"
              :img-alt="product.title"
              img-left
              img-width="35%"
              img-height="auto"
              class="product box-small"
            >
              <b-card-text>
                <div><small>{{ product.title }}</small></div>
                <div><small>{{ new Intl.NumberFormat('fa-IR').format(product.price) + ' ریال' }}</small></div>
                <router-link :to="{name: 'OrderCreate', query: Object.assign({product: product['@id']}, queryParams)}">
                  <b-button
                    style="float: left"
                    size="sm"
                    variant="success"
                  >
                    خرید
                  </b-button>
                </router-link>
              </b-card-text>
            </b-card>
          </template>
        </b-card-group>

        <b-card
          v-if="totalItems > itemsPerPage"
          class="text-center"
        >
          <b-card-body style="display: flex">
            <b-pagination
              v-model="currentPage"
              :total-rows="totalItems"
              :per-page="itemsPerPage"
            />
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
  props: {
    theme: {
      type: String,
      default: 'large'
    },

    queryParams: {
      type: Object,
      default: () => ({})
    },

    filters: {
      type: Object,
      default: () => ({
        unit: null,
        type: null,
        title: '',
        visibleFrom: { after: '' },
        visibleTill: { before: '' },
        active: null
      })
    }
  },

  data () {
    return {
      sortBy: 'id',
      sortDesc: false,
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
      totalItems: 'product/list/totalItems'
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

    filters: {
      deep: true,
      handler: debounce(function () {
        this.pageLoad()
      }, 500)
    }
  },

  created () {
    for (const query in this.$route.query) {
      if (this.filters.hasOwnProperty(query)) {
        this.filters[query] = this.$route.query[query]
      }
    }

    this.pageLoad()
  },

  beforeDestroy () {
    this.reset()
  },

  methods: {
    ...mapActions({
      getProductsList: 'product/list/getItems',
      productsReset: 'product/list/reset'
    }),

    pageLoad () {
      const query = { page: this.currentPage }
      if (this.sortBy) {
        query.order = { [this.sortBy]: this.sortDesc ? 'DESC' : 'ASC' }
      }

      for (const filter in this.filters) {
        if (filter === 'visibleFrom' || filter === 'visibleTill') {
          if ((filter === 'visibleFrom' && this.filters.visibleFrom.hasOwnProperty('after') && this.filters.visibleFrom.after) ||
                (filter === 'visibleTill' && this.filters.visibleTill.hasOwnProperty('after') && this.filters.visibleTill.before)
          ) {
            Object.assign(query, { [filter]: this.filters[filter] })
          }
        } else if (this.filters[filter]) {
          Object.assign(query, { [filter]: this.filters[filter] })
        }
      }

      if (this.lastQuery !== JSON.stringify(query)) {
        this.lastQuery = JSON.stringify(query)
        this.getProductsList({ query, progressBar: { request: 0, success: 100, fail: true } })
      }
    },

    reset () {
      this.productsReset()
    }
  }
}
</script>

<style lang="scss">
  ul.pagination.b-pagination {
    margin: auto;
  }
</style>
