<template>
  <form @submit.prevent="submit(item)">
    <b-form-group
      :horizontal="true"
      :label-cols="3"
      label="عنوان"
      label-for="product_title"
    >
      <input
        id="product_title"
        v-validate="'required'"
        name="title"
        data-vv-as="عنوان"
        :class="['form-control', isInvalid('title') ? 'is-invalid' : '']"
        placeholder="عنوان"
        type="text"
        :value="item.title"
        @input="handleUpdateField('title', $event.target.value)"
      >
      <div
        v-if="isInvalid('title')"
        class="invalid-feedback"
      >
        {{ violations.title }}
      </div>
      <div
        v-if="veeErrors.first('title')"
        class="invalid-feedback"
      >
        {{ errors.first('title') }}
      </div>
    </b-form-group>

    <b-form-group
      :horizontal="true"
      :label-cols="3"
      label="نوع"
      label-for="type"
    >
      <b-form-select
        id="type"
        v-validate="'required'"
        name="type"
        data-vv-as="نوع محصول"
        :class="['form-control', isInvalid('type') ? 'is-invalid' : '']"
        :options="[{text: 'لطفا نوع محصول را انتخاب نمایید', value: '', disabled: true}, ...types]"
        :plain="true"
        :value="item.type"
        @input="handleUpdateField('type', $event)"
      />
      <div
        v-if="veeErrors.first('type')"
        class="invalid-feedback"
      >
        {{ errors.first('type') }}
      </div>
    </b-form-group>

    <b-form-group
      :horizontal="true"
      :label-cols="3"
      label="قیمت"
      label-for="product_price"
    >
      <input
        id="product_price"
        v-validate="'required|numeric'"
        name="price"
        data-vv-as="قیمت"
        :class="['form-control', isInvalid('price') ? 'is-invalid' : '']"
        placeholder="قیمت"
        type="text"
        :value="item.price"
        @input="handleUpdateField('price', parseInt($event.target.value))"
      >
      <div
        v-if="isInvalid('price')"
        class="invalid-feedback"
      >
        {{ violations.price }}
      </div>
      <div
        v-if="veeErrors.first('price')"
        class="invalid-feedback"
      >
        {{ errors.first('price') }}
      </div>
    </b-form-group>

    <b-form-group
      :horizontal="true"
      :label-cols="3"
      label="تاریخ شروع"
      label-for="product_visibleFrom"
    >
      <date-picker
        id="product_visibleFrom"
        :input-class="isInvalid('visibleFrom') ? 'is-invalid form-control' : 'form-control'"
        display-format="dddd jDD jMMMM jYYYY"
        format="YYYY-MM-DD"
        placeholder="تاریخ شروع را انتخاب نمایید"
        :value="item.visibleFrom"
        @input="handleUpdateField('visibleFrom', $event)"
      />
      <div
        v-if="isInvalid('visibleFrom')"
        class="invalid-feedback"
      >
        {{ violations.visibleFrom }}
      </div>
    </b-form-group>

    <b-form-group
      :horizontal="true"
      :label-cols="3"
      label="تاریخ انقضا"
      label-for="product_visibleTill"
    >
      <date-picker
        id="product_visibleTill"
        :input-class="isInvalid('visibleTill') ? 'is-invalid form-control' : 'form-control'"
        display-format="dddd jDD jMMMM jYYYY"
        format="YYYY-MM-DD"
        placeholder="تاریخ انقضا را انتخاب نمایید"
        :value="item.visibleTill"
        @input="handleUpdateField('visibleTill', $event)"
      />
      <div
        v-if="isInvalid('visibleTill')"
        class="invalid-feedback"
      >
        {{ violations.visibleTill }}
      </div>
    </b-form-group>

    <b-form-group
      :horizontal="true"
      :label-cols="3"
      label="service"
      label-for="product_service"
    >
      <input
        id="product_service"
        v-validate="'required'"
        name="service"
        data-vv-as="پارامترهای سرویس"
        :class="['form-control', isInvalid('service') ? 'is-invalid' : '']"
        placeholder="service"
        type="text"
        :value="typeof item.service === 'object' ? JSON.stringify(item.service) : item.service"
        @input="handleUpdateField('service', JSON.parse($event.target.value))"
      >
      <div
        v-if="isInvalid('service')"
        class="invalid-feedback"
      >
        {{ violations.service }}
      </div>
      <div
        v-if="veeErrors.first('service')"
        class="invalid-feedback"
      >
        {{ errors.first('service') }}
      </div>
    </b-form-group>

    <b-form-group
      :horizontal="true"
      :label-cols="3"
      label="فعال؟"
      label-for="product_active"
    >
      <b-form-radio-group
        id="product_active"
        stacked
        value="1"
      >
        <div class="custom-control custom-radio">
          <input
            id="active-active"
            :class="['custom-control-input', isInvalid('active') ? 'is-invalid' : '']"
            :checked="item.active === true"
            name="active"
            required="true"
            type="radio"
            value="true"
            @change="handleUpdateField('active', true)"
          >
          <label
            class="custom-control-label"
            for="active-active"
          >فعال</label>
        </div>
        <div class="custom-control custom-radio">
          <input
            id="active-deactive"
            :class="['custom-control-input', isInvalid('active') ? 'is-invalid' : '']"
            :checked="item.active === false"
            name="active"
            required="true"
            type="radio"
            value="false"
            @change="handleUpdateField('active', false)"
          >
          <label
            class="custom-control-label"
            for="active-deactive"
          >غیرفعال</label>
        </div>
        <div
          v-if="isInvalid('active')"
          class="invalid-feedback"
        >
          {{ violations.active }}
        </div>
      </b-form-radio-group>
    </b-form-group>

    <button
      type="submit"
      class="btn btn-success"
    >
      Submit
    </button>
  </form>
</template>

<script>
import VuePersianDatetimePicker from 'vue-persian-datetime-picker'

export default {
  components: {
    datePicker: VuePersianDatetimePicker
  },

  props: {
    handleSubmit: {
      type: Function,
      required: true
    },

    handleUpdateField: {
      type: Function,
      required: true
    },

    values: {
      type: Object,
      required: true
    },

    violations: {
      type: Object,
      default: () => {
      }
    },

    initialValues: {
      type: Object,
      default: () => {}
    }
  },

  data () {
    return {
      units: [
        { text: 'ریال', value: 1 },
        { text: 'لیز', value: 2 }
      ],
      types: [
        { text: 'بسته فروش لیز', value: 1 },
        { text: 'افزودن دامنه', value: 2 },
        { text: 'مانیتوریگ یک دامنه', value: 3 },
        { text: 'افزایش محدودیت رایگان', value: 4 }
      ]
    }
  },

  computed: {
    item () {
      return this.initialValues || this.values
    }
  },

  watch: {
    'item.type': function (type) {
      switch (type) {
        case 1:
          this.handleUpdateField('service', { lizAmount: 0 })
          break
        case 2:
        case 3:
          this.handleUpdateField('service', { duration: 0, history: 0 })
          break
        case 4:
          this.handleUpdateField('service', { duration: 0 })
          break
      }
    }
  },

  methods: {
    isInvalid (key) {
      return (Object.keys(this.violations).length > 0 && this.violations[key]) ||
          (this.veeErrors && this.veeErrors.first(key))
    },

    submit () {
      this.$validator.validate().then((val) => {
        if (val) {
          this.handleSubmit()
        } else {
          this.$toasted.error(this.veeErrors.all()[0], { icon: 'icon-attention' })
        }
      }).catch((val) => { console.log(val) })
    }
  }
}
</script>
