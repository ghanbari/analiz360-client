<template>
  <d-container
    fluid
    class="main-content-container px-4 py-5"
  >
    <b-row>
      <b-col md="6">
        <b-card>
          <b-card-title><span class="icon-wpforms" /> اطلاعات محصول</b-card-title>
          <b-card-sub-title>&nbsp;</b-card-sub-title>

          <ProductForm
            :handle-submit="onSendForm"
            :handle-update-field="updateField"
            :values="item"
            :violations="violations"
          />
        </b-card>
      </b-col>
      <b-col md="6">
        <b-card>
          <b-card-title><span class="icon-picture" />تصویر</b-card-title>
          <b-card-sub-title>&nbsp;</b-card-sub-title>
          <b-row>
            <b-col md="12">
              <vue-core-image-upload
                url="/api/media"
                :headers="{Authorization: `Bearer ${$store.getters.apiKey}`, Accept: 'application/ld+json'}"
                input-of-file="file"
                :crop="false"
                :compress="0"
                :max-file-size="5242880"
                :max-width="500"
                :max-height="500"
                @imageuploaded="imageUploaded"
              >
                <img
                  width="150"
                  :src="image"
                >
              </vue-core-image-upload>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </d-container>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
import VueCoreImageUpload from 'vue-core-image-upload'
import ProductForm from './Form'

const productMap = createNamespacedHelpers('product/create')

export default {
  components: {
    ProductForm,
    'vue-core-image-upload': VueCoreImageUpload
  },

  data () {
    return {
      item: {
        type: '',
        service: {}
      },
      image: '/default/upload_md.png'
    }
  },

  computed: {
    ...productMap.mapGetters({
      productCreateError: 'error',
      productCreateLoading: 'isLoading',
      productCreated: 'created',
      productCreateViolations: 'violations'
    }),

    violations () {
      return Object.assign({}, this.productCreateViolations)
    }
  },

  watch: {
    productCreated (productCreated) {
      if (productCreated) {
        this.$toasted.success('محصول با موفقیت ساخته شد.', { icon: 'icon-box' })
        this.$router.push({ name: 'ProductList' })
      }
    },

    productCreateError (val) {
      if (val) {
        this.$toasted.error(val, { icon: 'icon-attention' })
      }
    }
  },

  beforeDestroy () {
    this.reset()
  },

  methods: {
    ...productMap.mapActions({
      productCreate: 'create',
      productReset: 'reset'
    }),

    reset () {
      this.productReset()
    },

    updateField (field, value) {
      Object.assign(this.item, { [field]: value })
    },

    imageUploaded (response) {
      if (response.hasOwnProperty('@id')) {
        this.image = `/media/${response.contentUrl}`
        this.updateField('image', response['@id'])
      } else {
        this.$toasted.error('تصویر اپلود نشد', { icon: 'icon-attention' })
      }
    },

    onSendForm () {
      this.productCreate(this.item)
    }
  }
}
</script>
