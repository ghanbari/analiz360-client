<template>
  <d-card class="card-small mb-4">
    <!-- Card Header -->
    <d-card-header class="border-bottom">
      <h6 class="m-0">
        {{ title }}
      </h6>
    </d-card-header>

    <d-list-group flush>
      <d-list-group-item class="p-3">
        <d-row>
          <d-col>
            <d-form @submit.prevent="submit(item)">
              <d-form-row>
                <d-col
                  md="6"
                  class="form-group"
                >
                  <label for="feFirstName">نام</label>
                  <d-form-input
                    id="feFirstName"
                    v-validate="'required'"
                    type="text"
                    name="firstName"
                    placeholder="نام"
                    data-vv-as="نام"
                    :state="!isInvalid('firstName') && validateState('firstName')"
                    :value="item.firstName"
                    @input="handleUpdateField('firstName', $event)"
                  />
                  <b-form-invalid-feedback>
                    <span v-if="violations && violations.hasOwnProperty('firstName')">{{ violations.firstName }}</span>
                    <span v-else>{{ veeErrors.first('firstName') }}</span>
                  </b-form-invalid-feedback>
                </d-col>

                <d-col
                  md="6"
                  class="form-group"
                >
                  <label for="feLastName">نام خانوادگی</label>
                  <d-form-input
                    id="feLastName"
                    v-validate="'required'"
                    type="text"
                    name="lastName"
                    placeholder="نام خانوادگی"
                    data-vv-as="نام خانوادگی"
                    :state="!isInvalid('lastName') && validateState('lastName')"
                    :value="item.lastName"
                    @input="handleUpdateField('lastName', $event)"
                  />
                  <b-form-invalid-feedback>
                    <span v-if="violations && violations.hasOwnProperty('lastName')">{{ violations.lastName }}</span>
                    <span v-else>{{ veeErrors.first('lastName') }}</span>
                  </b-form-invalid-feedback>
                </d-col>
              </d-form-row>

              <d-form-row>
                <d-col
                  md="6"
                  class="form-group"
                >
                  <label for="feInputProvince">استان</label>
                  <b-form-select
                    id="feInputProvince"
                    v-model="province"
                    :options="[{text: 'لطفا استان مورد نظر را انتخاب نمایید', value: 0, disabled: true}, ...provinces]"
                    :plain="false"
                  />
                </d-col>

                <d-col
                  md="6"
                  class="form-group"
                >
                  <label for="feInputCity">شهر</label>
                  <b-form-select
                    id="feInputCity"
                    :state="!isInvalid('city') && validateState('city')"
                    :disabled="citiesLoading || !provincesCities"
                    :options="[{text: 'لطفا شهر مورد نظر را انتخاب نمایید', value: 0, disabled: true}, ...provincesCities]"
                    :plain="false"
                    :value="item.city"
                    @change="handleUpdateField('city', $event)"
                  />
                  <div
                    v-if="isInvalid('city')"
                    class="invalid-feedback"
                  >
                    {{ violations.city }}
                  </div>
                </d-col>
              </d-form-row>

              <d-form-row>
                <d-col
                  md="6"
                  class="form-group"
                >
                  <label for="feEmail">ایمیل</label>
                  <d-form-input
                    id="feEmail"
                    disabled
                    type="email"
                    placeholder="ایمیل"
                    :value="item.email"
                  />
                </d-col>

                <d-col
                  md="6"
                  class="form-group text-center"
                >
                  <label for="feSex">جنسیت</label>
                  <b-form-radio-group
                    id="feSex"
                    :horizontal="true"
                    value="m"
                  >
                    <div class="custom-control custom-radio custom-control-inline">
                      <input
                        id="sex-male"
                        :class="['custom-control-input', isInvalid('sex') ? 'is-invalid' : '']"
                        name="sex"
                        required
                        type="radio"
                        :checked="item.sex === 'm'"
                        value="m"
                        @change="handleUpdateField('sex', $event.target.value)"
                      >
                      <label
                        class="custom-control-label"
                        for="sex-male"
                      >مرد</label>
                    </div>
                    <div class="custom-control custom-radio custom-control-inline">
                      <input
                        id="sex-female"
                        :class="['custom-control-input', isInvalid('sex') ? 'is-invalid' : '']"
                        name="sex"
                        required
                        type="radio"
                        :checked="item.sex === 'f'"
                        value="f"
                        @change="handleUpdateField('sex', $event.target.value)"
                      >
                      <label
                        class="custom-control-label"
                        for="sex-female"
                      >زن</label>
                    </div>
                    <div
                      v-if="isInvalid('sex')"
                      class="invalid-feedback"
                    >
                      {{ violations.sex }}
                    </div>
                  </b-form-radio-group>
                </d-col>
              </d-form-row>

              <d-button
                :disabled="veeErrors.any()"
                type="submit"
                class="btn-success"
              >
                ثبت تغییرات
              </d-button>
            </d-form>
          </d-col>
        </d-row>
      </d-list-group-item>
    </d-list-group>
  </d-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'UserAccountDetails',

  props: {
    title: {
      type: String,
      default: 'ویرایش پروفایل'
    },

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
      default: () => {
      }
    }
  },

  data () {
    return {
      province: 0
    }
  },

  computed: {
    item () {
      return this.initialValues || this.values
    },

    ...mapGetters({
      provinces: 'province/list/itemsForSelect',
      citiesLoading: 'province/cities/isLoading',
      provincesCities: 'province/cities/itemsForSelect',
      cityInfo: 'city/show/retrieved'
    })
  },

  watch: {
    province () {
      this.provinceCitiesLoad({ province: this.province })
    },

    cityInfo (val) {
      if (val) {
        this.province = val.province
      }
    },

    item (val) {
      if (val) {
        if (!this.cityInfo && val.city) {
          this.cityLoad({ id: val.city })
        }
      }
    }
  },

  created () {
    this.provincesLoad()
  },

  beforeDestroy () {
    this.reset()
  },

  methods: {
    ...mapActions({
      provincesLoad: 'province/list/getItems',
      provinceCitiesLoad: 'province/cities/getItems',
      cityLoad: 'city/show/retrieve',
      provinceCitiesReset: 'province/cities/reset',
      cityReset: 'city/show/reset'
    }),

    isInvalid (key) {
      if (Object.keys(this.violations).length > 0) {
        return this.violations.hasOwnProperty(key)
      }

      return null
    },

    validateState (ref) {
      if (this.veeFields[ref] && (this.veeFields[ref].dirty || this.veeFields[ref].validated)) {
        return !this.veeErrors.has(ref)
      }
      return null
    },

    submit () {
      this.$validator.validate().then((val) => {
        if (val) {
          this.handleSubmit()
        } else {
          this.$toasted.error(this.veeErrors.all()[0], { icon: 'icon-attention' })
        }
      }).catch((val) => { console.log(val) })
    },

    reset () {
      this.cityReset()
      this.provinceCitiesReset()
    }
  }
}
</script>
