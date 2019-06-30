<template>
  <d-container
    v-if="order"
    fluid
    class="main-content-container px-4"
  >
    <b-row>
      <b-col class="py-5">
        <b-card
          :img-src="order.product.imagePath && order.product.imagePath.replace('product_large', 'product_medium')"
          :img-alt="order.product.title"
          img-left
          class="product"
        >
          <b-card-text class="details">
            <div
              v-if="order.product.type === 1"
              class="service pb-3"
            >
              <div v-if="order.status === 1">
                <p>پرداخت با موفقیت انجام شد</p>
              </div>
              <div v-if="order.status === -1">
                <p>پرداخت توسط شما لغو شده است</p>
              </div>
              <div v-if="order.status === 0">
                <p>پرداخت با خطا مواجه شده است</p>
              </div>
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
  computed: {
    ...mapGetters({
      orderError: 'order/show/error',
      orderLoading: 'order/show/isLoading',
      order: 'order/show/retrieved'
    })
  },

  beforeDestroy () {
    this.reset()
  },

  created () {
    const id = this.$route.query.order
    this.retrieve(`/api/orders/${id}`)
  },

  methods: {
    ...mapActions({
      reset: 'order/show/reset',
      retrieve: 'order/show/retrieve'
    })
  }
}
</script>
