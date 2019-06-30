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
            v-if="item"
            :handle-submit="onSendForm"
            :handle-update-field="updateField"
            :values="item"
            :violations="violations"
            :initial-values="productRetrieved"
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

const productMap = createNamespacedHelpers('product/update')

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
      }
    }
  },

  computed: {
    ...productMap.mapGetters({
      productUpdateError: 'error',
      productUpdateLoading: 'isLoading',
      productRetrieved: 'retrieved',
      productUpdated: 'updated',
      productUpdateViolations: 'violations'
    }),

    violations () {
      return Object.assign({}, this.productUpdateViolations)
    },

    image () {
      return this.productUpdated && this.productUpdated.hasOwnProperty('imagePath') ? this.productUpdated.imagePath
        : this.productRetrieved && this.productRetrieved.hasOwnProperty('imagePath') ? this.productRetrieved.imagePath : '/default/upload_md.png'
    }
  },

  watch: {
    productUpdated (updated) {
      if (updated) {
        this.$toasted.success('محصول با موفقیت بروزرسانی شد.', { icon: 'icon-box' })
        this.$router.push({ name: 'ProductList' })
      }
    },

    productUpdateError (val) {
      if (val) {
        this.$toasted.error(val, { icon: 'icon-attention' })
      }
    }
  },

  created () {
    this.productRetrieve(decodeURIComponent(this.$route.params.id))
  },

  beforeDestroy () {
    this.reset()
  },

  methods: {
    ...productMap.mapActions({
      productRetrieve: 'retrieve',
      update: 'update',
      updateProductRetrieved: 'updateRetrieved',
      updateReset: 'reset'
    }),

    reset () {
      this.updateReset()
    },

    updateField (field, value) {
      this.updateProductRetrieved({ [field]: value })
    },

    imageUploaded (response) {
      if (response.hasOwnProperty('@id')) {
        this.updateField('image', response['@id'])
      } else {
        this.$toasted.error('تصویر اپلود نشد', { icon: 'icon-attention' })
      }
    },

    onSendForm () {
      this.update()
    }
  }
}
</script>

<style>
  .slideContainer {
    padding: 0 20px;
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translate(0%, -50%);
  }

  /* The slider itself */
  .slider {
    -webkit-appearance: none;  /* Override default CSS styles */
    appearance: none;
    width: 100%; /* Full-width */
    height: 25px; /* Specified height */
    background: #d3d3d3; /* Grey background */
    outline: none; /* Remove outline */
    opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
    -webkit-transition: .2s; /* 0.2 seconds transition on hover */
    transition: opacity .2s;
  }

  /* Mouse-over effects */
  .slider:hover {
    opacity: 1; /* Fully shown on mouse-over */
  }

  .slider {
    -webkit-appearance: none;
    width: 100%;
    height: 15px;
    border-radius: 5px;
    background: #d3d3d3;
    outline: none;
    opacity: 0.7;
    -webkit-transition: .2s;
    transition: opacity .2s;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #4CAF50;
    cursor: pointer;
  }

  .slider::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #4CAF50;
    cursor: pointer;
  }

  .slider:disabled::-webkit-slider-thumb {
    background: gray;
  }

  .slider:disabled::-moz-range-thumb {
    background: gray;
  }
</style>
