<template>
  <form @submit.prevent="submit(item)">
    <b-form-group
      :horizontal="true"
      :label-cols="1"
      label="نام"
      label-for="emailTemplate_name"
    >
      <input
        id="emailTemplate_name"
        v-validate="'required|max:255'"
        name="name"
        data-vv-as="نام قالب"
        :value="item.name"
        :class="['form-control', isInvalid('name') ? 'is-invalid' : '']"
        type="text"
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
      :label-cols="1"
      label="قالب"
      label-for="emailTemplate_template"
    >
      <textarea
        id="emailTemplate_template"
        v-validate="'required|max:1048576'"
        name="template"
        data-vv-as="کد قالب"
        :class="['form-control', isInvalid('template') ? 'is-invalid' : '']"
        type="text"
        rows="10"
        :value="item.template"
        @input="handleUpdateField('template', $event.target.value)"
      />
      <div
        v-if="isInvalid('template')"
        class="invalid-feedback"
      >
        {{ violations.template }}
      </div>
      <div
        v-if="veeErrors.first('template')"
        class="invalid-feedback"
      >
        {{ errors.first('template') }}
      </div>
    </b-form-group>

    <button
      type="submit"
      class="btn btn-success"
    >
      ثبت
    </button>
    <button
      v-if="deleteMessage"
      class="btn btn-danger"
      @click.prevent="deleteMessage"
    >
      حذف
    </button>
    <!--<router-link :to="{name: 'Home'}"><button class="btn btn-warning" type="submit">بازگشت</button></router-link>-->
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
      default: () => {}
    },

    initialValues: {
      type: Object,
      default: () => {}
    },

    deleteMessage: {
      type: Function,
      required: false,
      default: null
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
