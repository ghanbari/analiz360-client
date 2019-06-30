<template>
  <form @submit.prevent="submit(item)">
    <b-row>
      <b-col
        v-if="$user && $user.roles.indexOf('ROLE_ADMIN') > -1"
        md="6"
      >
        <b-form-group
          v-if="$remoteConfig.get('registration.type') == 'phone'"
          description="شماره همراه همان نام کاربری می باشد"
          label="شماره همراه"
          label-for="user_phone"
        >
          <input
            id="user_phone"
            v-validate="'required|numeric|max:11|min:11'"
            name="phone"
            data-vv-as="شماره همراه"
            :class="['form-control', isInvalid('phone') ? 'is-invalid' : '']"
            :disabled="initialValues !== undefined"
            autocomplete="phone"
            placeholder="شماره همراه کاربر را وارد نمایید"
            type="text"
            :value="item.phone"
            @input="handleUpdateField('phone', $event.target.value)"
          >
          <div
            v-if="isInvalid('phone')"
            class="invalid-feedback"
          >
            {{ violations.phone }}
          </div>
          <div
            v-if="isInvalid('username')"
            class="invalid-feedback"
          >
            {{ violations.username }}
          </div>
          <div
            v-if="veeErrors.first('phone')"
            class="invalid-feedback"
          >
            {{ errors.first('phone') }}
          </div>
        </b-form-group>

        <b-form-group
          v-if="$remoteConfig.get('registration.type') == 'email'"
          description="پست الکترونیک همان نام کاربری می باشد"
          label="پست الکترونیک"
          label-for="user_email"
        >
          <input
            id="user_email"
            v-validate="'required|email'"
            name="email"
            data-vv-as="پست الکترونیک"
            :class="['form-control', isInvalid('email') ? 'is-invalid' : '']"
            :disabled="initialValues !== undefined"
            autocomplete="email"
            placeholder="پست الکترونیک را وارد نمایید"
            type="email"
            :value="item.email"
            @input="handleUpdateField('email', $event.target.value)"
          >
          <div
            v-if="isInvalid('email')"
            class="invalid-feedback"
          >
            {{ violations.email }}
          </div>
          <div
            v-if="veeErrors.first('email')"
            class="invalid-feedback"
          >
            {{ errors.first('email') }}
          </div>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="6">
        <b-form-group
          label="نام"
          label-for="user_firstName"
        >
          <input
            id="user_firstName"
            v-validate="'required'"
            name="firstName"
            data-vv-as="نام"
            :class="['form-control', isInvalid('firstName') ? 'is-invalid' : '']"
            placeholder="نام"
            type="text"
            :value="item.firstName"
            @input="handleUpdateField('firstName', $event.target.value)"
          >
          <div
            v-if="isInvalid('firstName')"
            class="invalid-feedback"
          >
            {{ violations.firstName }}
          </div>
          <div
            v-if="veeErrors.first('firstName')"
            class="invalid-feedback"
          >
            {{ errors.first('firstName') }}
          </div>
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group
          label="نام خانوادگی"
          label-for="user_lastName"
        >
          <input
            id="user_lastName"
            v-validate="'required'"
            name="lastName"
            data-vv-as="نام خانوادگی"
            :class="['form-control', isInvalid('lastName') ? 'is-invalid' : '']"
            placeholder="نام خانوادگی"
            type="text"
            :value="item.lastName"
            @input="handleUpdateField('lastName', $event.target.value)"
          >
          <div
            v-if="isInvalid('lastName')"
            class="invalid-feedback"
          >
            {{ violations.lastName }}
          </div>
          <div
            v-if="veeErrors.first('lastName')"
            class="invalid-feedback"
          >
            {{ errors.first('lastName') }}
          </div>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="6">
        <b-form-group
          label="استان"
          label-for="province"
        >
          <b-form-select
            id="province"
            v-model="province"
            :options="[{text: 'لطفا استان مورد نظر را انتخاب نمایید', value: 0, disabled: true}, ...provinces]"
            :plain="true"
          />
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group
          label="شهر"
          label-for="city"
        >
          <b-form-select
            id="city"
            :class="['form-control', isInvalid('city') ? 'is-invalid' : '']"
            :disabled="citiesLoading || !provincesCities"
            :options="provincesCities"
            :plain="true"
            :value="item.city"
            @change="handleUpdateField('city', $event)"
          />
          <div
            v-if="isInvalid('city')"
            class="invalid-feedback"
          >
            {{ violations.city }}
          </div>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="4">
        <b-form-group
          label="تاریخ تولد"
          label-for="user_birthday"
        >
          <date-picker
            id="user_birthday"
            :input-class="isInvalid('birthday') ? 'is-invalid form-control' : 'form-control'"
            display-format="dddd jDD jMMMM jYYYY"
            format="YYYY-MM-DD"
            placeholder="تاریخ تولد را انتخاب نمایید"
            :value="item.birthday"
            @input="handleUpdateField('birthday', $event)"
          />
          <div
            v-if="isInvalid('birthday')"
            class="invalid-feedback"
          >
            {{ violations.birthday }}
          </div>
        </b-form-group>
      </b-col>
      <b-col md="4">
        <b-form-group
          style="text-align: center"
          label="جنسیت"
          label-for="user_sex"
        >
          <b-form-radio-group
            id="user_sex"
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
        </b-form-group>
      </b-col>
      <b-col md="4">
        <b-form-group
          style="text-align: center"
          label="فعال؟"
          label-for="user_status"
        >
          <b-form-radio-group
            id="user_status"
            value="1"
          >
            <div class="custom-control custom-radio custom-control-inline">
              <input
                id="status-active"
                :class="['custom-control-input', isInvalid('status') ? 'is-invalid' : '']"
                :checked="item.status === 1"
                name="status"
                required="true"
                type="radio"
                value="1"
                @change="handleUpdateField('status', parseInt($event.target.value))"
              >
              <label
                class="custom-control-label"
                for="status-active"
              >فعال</label>
            </div>
            <div class="custom-control custom-radio custom-control-inline">
              <input
                id="status-deactive"
                :class="['custom-control-input', isInvalid('status') ? 'is-invalid' : '']"
                :checked="item.status === 0"
                name="status"
                required="true"
                type="radio"
                value="0"
                @change="handleUpdateField('status', parseInt($event.target.value))"
              >
              <label
                class="custom-control-label"
                for="status-deactive"
              >غیرفعال</label>
            </div>
            <div
              v-if="isInvalid('status')"
              class="invalid-feedback"
            >
              {{ violations.status }}
            </div>
          </b-form-radio-group>
        </b-form-group>
      </b-col>
    </b-row>

    <button
      class="btn btn-success"
      style="float: left;"
      type="submit"
    >
      ثبت
    </button>
    <!--<router-link :to="{name: 'Home'}"><button class="btn btn-warning" type="submit">بازگشت</button></router-link>-->
  </form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
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
      return (Object.keys(this.violations).length > 0 && this.violations[key]) ||
            (this.errors && this.errors.first(key))
    },

    submit () {
      this.$validator.validate().then((val) => {
        if (val) {
          this.handleSubmit()
        } else {
          this.$toasted.error(this.errors.all()[0], { icon: 'icon-attention' })
          this.$toasted.clear()
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
