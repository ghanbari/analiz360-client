<template>
  <form @submit.prevent="submit(item)">
    <b-form-group
      v-if="$user && $user.roles.indexOf('ROLE_ADMIN') > -1"
      :horizontal="true"
      :label-cols="2"
      label="نام"
      label-for="domain_name"
    >
      <input
        id="domain_name"
        v-validate="'required'"
        name="name"
        data-vv-as="نام"
        :class="['form-control', isInvalid('name') ? 'is-invalid' : '']"
        placeholder="نام"
        type="text"
        :value="item.name"
        @input="handleUpdateField('name', $event.target.value)"
      >
      <div
        v-if="isInvalid('name')"
        class="invalid-feedback"
      >
        {{ violations.name }}
      </div>
      <div
        v-if="veeErrors.first('name')"
        class="invalid-feedback"
      >
        {{ errors.first('name') }}
      </div>
    </b-form-group>

    <b-form-group
      :horizontal="true"
      :label-cols="2"
      label="دامنه"
      label-for="domain_address"
    >
      <div
        role="group"
        class="input-group mt-3"
      >
        <input
          id="domain_address"
          v-validate="'required'"
          name="domain"
          data-vv-as="دامنه"
          :class="['form-control', isInvalid('domain') ? 'is-invalid' : '']"
          placeholder="دامنه"
          type="text"
          :value="item.domain"
          dir="ltr"
          @input="handleUpdateField('domain', $event.target.value)"
        >
        <div class="input-group-prepend">
          <div
            style="direction: ltr"
            class="input-group-text"
          >
            http://www.
          </div>
        </div>
      </div>
      <div
        v-if="isInvalid('domain')"
        class="invalid-feedback"
      >
        {{ violations.domain }}
      </div>
      <div
        v-if="veeErrors.first('domain')"
        class="invalid-feedback"
      >
        {{ errors.first('domain') }}
      </div>
    </b-form-group>

    <b-form-group
      v-if="$user && $user.roles.indexOf('ROLE_ADMIN') > -1"
      :horizontal="true"
      :label-cols="2"
      label="فعال؟"
      label-for="domain_status"
    >
      <b-form-radio-group
        id="domain_status"
        stacked
        value="1"
      >
        <div class="custom-control custom-radio">
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
        <div class="custom-control custom-radio">
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

    <button
      class="btn btn-success"
      type="submit"
    >
      ثبت
    </button>
  </form>
</template>

<script>
export default {
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

  computed: {
    item () {
      return this.initialValues || this.values
    }
  },

  methods: {
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
        }
      }).catch((val) => { console.log(val) })
    }
  }
}
</script>
