<template>
  <d-container
    v-if="product"
    fluid
    class="main-content-container px-4"
  >
    <!-- Page Header -->
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <span class="text-uppercase page-subtitle">{{ new Intl.NumberFormat('fa-IR').format(product.price) }} {{ product.unit === 1 ? 'ریال' : 'لیز' }}</span>
        <h3 class="page-title">
          {{ product.title }}
        </h3>
      </div>
    </div>

    <b-row>
      <b-col class="pb-5">
        <b-card
          :img-src="product.imagePath && product.imagePath.replace('product_large', 'product_medium')"
          :img-alt="product.title"
          img-left
          class="product"
        >
          <b-card-text class="details">
            <div
              v-if="product.type === 1"
              class="service pb-3"
            >
              <span>شما قصد خرید "{{ product.title }}" به قیمت "{{ new Intl.NumberFormat('fa-IR').format(product.price) }} ریال" را دارید، برای تکمیل فرآیند بر روی دکمه خرید کلیک نمایید.</span>
            </div>
            <div
              v-if="product.type === 3"
              class="service pb-3"
            >
              <span>قابل استفاده تا تاریخ</span>
              <span>{{ (new Date(new Date().getTime() + (product.service.duration * 24 * 60 * 60 * 1000))).toLocaleDateString('fa-IR') }}</span>
              <span> با امکان دسترسی به آرشیو {{ new Intl.NumberFormat('fa-IR').format(product.service.history) }} روزه</span>
              <span v-if="domain"><a :href="(domain.secure ? 'https://' : 'http://') + domain.domain">{{ domain.name }}</a></span>
            </div>
            <div class="actions">
              <b-button
                size="sm"
                variant="danger"
                class="d-block d-sm-inline mx-auto"
                @click="$router.go(-1)"
              >
                بازگشت
              </b-button>
              <b-button
                :disabled="product.unit === 2 && $user.credit < product.price"
                size="sm"
                class="mr-sm-2 mt-sm-0 mt-2 mx-auto d-block d-sm-inline"
                variant="success"
                @click="addOrder"
              >
                خرید
                ({{ new Intl.NumberFormat('fa-IR').format(product.price) }}
                <span v-if="product.unit === 1">﷼</span>
                <span
                  v-else
                  class="icon-money"
                />)
                <span v-if="product.unit === 2 && $user.credit < product.price">(موجودی شما کافی نیست)</span>
              </b-button>
              <router-link :to="{name: 'ShopProducts', query: {type: 1}}">
                <b-button
                  v-if="product.unit === 2 && $user.credit < product.price"
                  variant="primary"
                  size="sm"
                >
                  شارژ حساب
                </b-button>
              </router-link>
            </div>
          </b-card-text>
        </b-card>
      </b-col>
    </b-row>
  </d-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {

  data () {
    return {
    }
  },

  computed: {
    ...mapGetters({
      domain: 'domain/show/retrieved',
      domainLoading: 'domain/show/isLoading',
      domainError: 'domain/show/error',
      product: 'product/show/retrieved',
      productLoading: 'product/show/isLoading',
      productError: 'product/show/error',
      orderCreated: 'order/create/created',
      orderError: 'order/create/error',
      orderLoading: 'order/create/isLoading',
      orderViolations: 'order/create/violations'
    })
  },

  watch: {
    orderCreated (orderCreated) {
      if (!orderCreated) {
        return
      }

      this.$toasted.success('سفارش با موفقیت ثبت شد.', { icon: 'icon-box' })
      this.$toasted.info('در حال انتقال به درگاه پرداخت...', { icon: 'icon-spin1' })
      if (this.product.type === 1) {
        window.location = orderCreated.info.gateway
      } else {
        this.$router.go(-2)
      }
    },

    product (product) {
      if (product.type === 3) {
        this.domainLoad(this.$route.query.domain)
      }
    },

    orderError (error) {
      this.$toasted.error(error, { icon: 'icon-attention' })
    },

    orderViolations (violations) {
      this.$toasted.error(violations, { icon: 'icon-attention' })
    }
  },

  created () {
    this.productLoad(this.$route.query.product)
  },

  beforeDestroy () {
    this.reset()
  },

  methods: {
    ...mapActions({
      domainLoad: 'domain/show/retrieve',
      domainReset: 'domain/show/reset',
      productLoad: 'product/show/retrieve',
      productReset: 'product/show/reset',
      orderCreate: 'order/create/create',
      orderReset: 'order/create/reset'
    }),

    addOrder () {
      const options = {}

      const order = {
        product: this.product['@id']
      }

      if (this.product.type === 3) {
        order.info = {
          domain: this.domain.domain
        }
      } else if (this.product.type === 1) {
        if (!options.hasOwnProperty('query')) {
          options.query = {}
        }

        const callback = this.$router.resolve({ name: 'OrderConfirm' })
        options.query.callback = `${window.location.origin}/${callback.href}`
      }

      this.orderCreate({ order, options })
    },

    reset () {
      this.orderReset()
      this.productReset()
      this.domainReset()
    }
  }
}
</script>

<style lang="scss">
  .app-body {
    .product {
      .details {
        font-size: 14px;
        line-height: 28px;
        font-weight: bold;

        .actions {
          float: left;
        }
      }
    }
  }
</style>
