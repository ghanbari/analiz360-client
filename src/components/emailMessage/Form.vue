<template>
  <form @submit.prevent="submit(item)">
    <b-form-group
      :horizontal="true"
      :label-cols="1"
      label="قالب ایمیل"
      label-for="scheduledMessage_template"
    >
      <b-form-select
        id="scheduledMessage_template"
        v-validate="'required'"
        name="template"
        data-vv-as="قالب"
        :class="['form-control', isInvalid('template') ? 'is-invalid' : '']"
        :options="emailTemplates"
        :plain="true"
        :value="emailTemplateId"
        @change="emailTemplateId = $event"
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

    <b-form-group
      v-if="emailTemplate !== undefined"
      :horizontal="true"
      :label-cols="1"
      label="متغیرهای ایمیل"
    >
      <b-row class="form-group">
        <b-col
          v-for="(parameter, index) in emailTemplate.parameters"
          :key="index"
          md="4"
        >
          <b-form-input
            style="margin-bottom: 16px"
            type="text"
            :placeholder="parameter"
            :value="item.arguments[parameter]"
            @change="updateArguments(parameter, $event)"
          />
        </b-col>
      </b-row>
      <div
        v-if="isInvalid('template')"
        class="invalid-feedback"
      >
        {{ violations.template }}
      </div>
    </b-form-group>

    <b-form-group
      :horizontal="true"
      :label-cols="1"
      label="ارسال کننده"
      label-for="scheduledMessage_senderEmail"
    >
      <input
        id="scheduledMessage_senderEmail"
        :value="item.senderEmail"
        :class="['form-control', isInvalid('maxUsageCount') ? 'is-invalid' : '']"
        type="email"
        placeholder="فرستنده ایمیل"
        @input="handleUpdateField('senderEmail', $event.target.value)"
      >
      <div
        v-if="isInvalid('senderEmail')"
        class="invalid-feedback"
      >
        {{ violations.senderEmail }}
      </div>
    </b-form-group>

    <b-form-group
      :horizontal="true"
      :label-cols="1"
      label="الویت"
      label-for="scheduledMessage_priority"
    >
      <input
        id="scheduledMessage_priority"
        :value="item.priority"
        :class="['form-control', isInvalid('priority') ? 'is-invalid' : '']"
        type="number"
        placeholder="الویت بیشتر باعث ارسال زودتر پیامک می شود"
        @input="handleUpdateField('priority', parseInt($event.target.value))"
      >
      <div
        v-if="isInvalid('priority')"
        class="invalid-feedback"
      >
        {{ violations.priority }}
      </div>
    </b-form-group>

    <b-form-group
      :horizontal="true"
      :label-cols="1"
      label="زمان ارسال"
      label-for="message_time"
    >
      <date-picker
        id="message_time"
        v-validate="'required'"
        name="time"
        data-vv-as="زمان ارسال"
        :disabled="initialValues !== undefined"
        :input-class="isInvalid('time') ? 'is-invalid form-control' : 'form-control'"
        :required="true"
        display-format="dddd jDD jMMMM jYYYY HH:mm:ss"
        format="YYYY-MM-DD HH:mm:ss"
        placeholder="زمان ارسال پیام را مشخص نمایید"
        type="datetime"
        :value="item.time"
        @input="handleUpdateField('time', $event)"
      />
      <div
        v-if="isInvalid('time')"
        class="invalid-feedback"
      >
        {{ violations.time }}
      </div>
      <div
        v-if="veeErrors.first('time')"
        class="invalid-feedback"
      >
        {{ errors.first('time') }}
      </div>
    </b-form-group>

    <template v-if="!initialValues">
      <b-form-group
        label-for="send-all"
        :label-cols="null"
        :horizontal="true"
      >
        <b-form-checkbox-group
          id="send-all"
          stacked
        >
          <div class="custom-control custom-checkbox">
            <input
              id="send-all-checkbox"
              v-model="item.all"
              type="checkbox"
              class="custom-control-input"
              checked
            >
            <label
              class="custom-control-label"
              for="send-all-checkbox"
            >ارسال به همه</label>
          </div>
        </b-form-checkbox-group>
      </b-form-group>

      <b-form-group
        :horizontal="true"
        :label-cols="1"
        label="گیرندگان"
        label-for="sms_users"
      >
        <b-form-group
          :horizontal="true"
          :label-cols="1"
          label-for="sms_users"
        >
          <v-select
            v-model="item.selectedUsers"
            :disabled="item.all"
            multiple
            label="@id"
            :filterable="false"
            :options="searchedUsers"
            @search="onSearch"
          >
            <template slot="no-options">
              نام خانوادگی کاربر را وارد نمایید
            </template>
            <template
              slot="option"
              slot-scope="option"
            >
              <div class="d-center">
                {{ option.firstName }} {{ option.lastName }}
              </div>
            </template>
            <template
              slot="selected-option"
              slot-scope="option"
            >
              <div class="selected d-center">
                <img
                  style="width: 40px; height: 40px"
                  :src="'/media/cache/resolve/avatar/media/' + (option.avatar ? option.avatar.contentUrl : 'default_avatar.jpg')"
                >
                {{ option.firstName }} {{ option.lastName }}
              </div>
            </template>
          </v-select>
        </b-form-group>

        <b-form-group
          :horizontal="true"
          :label-cols="1"
          label-for="sms_users"
        >
          <v-select
            v-model="item.receptors"
            multiple
            :disabled="item.all"
            :taggable="true"
          >
            <template slot="no-options">
              آدرس های ایمیل های خود را وارد نمایید
            </template>
          </v-select>
          <div
            v-if="isInvalid('receptors')"
            class="invalid-feedback"
          >
            {{ violations.receptors }}
          </div>
        </b-form-group>
      </b-form-group>
    </template>
    <template v-else>
      <b-form-group
        :horizontal="true"
        :label-cols="1"
        label="گیرنده"
        label-for="sms_receptor"
      >
        <input
          id="sms_receptor"
          v-validate="'required|email|max:255'"
          name="receptor"
          data-vv-as="گیرنده"
          :class="['form-control', isInvalid('receptor') ? 'is-invalid' : '']"
          :value="item.receptor"
          @input="handleUpdateField('receptor', $event.target.value)"
        >
        <div
          v-if="isInvalid('receptor')"
          class="invalid-feedback"
        >
          {{ violations.receptor }}
        </div>
        <div
          v-if="veeErrors.first('receptor')"
          class="invalid-feedback"
        >
          {{ errors.first('receptor') }}
        </div>
      </b-form-group>
    </template>
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
import { mapGetters, mapActions } from 'vuex'
import VuePersianDatetimePicker from 'vue-persian-datetime-picker'
import vSelect from 'vue-select'
import debounce from 'lodash/debounce'

export default {
  components: {
    datePicker: VuePersianDatetimePicker,
    'v-select': vSelect
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

  data () {
    return {
      args: {},
      searchedUsers: []
    }
  },

  computed: {
    // eslint-disable-next-line
    item () {
      return this.initialValues || this.values
    },

    emailTemplateId: {
      get () {
        return this.item.hasOwnProperty('template') ? this.item.template : ''
      },

      set (val) {
        this.handleUpdateField('template', val)
        this.args = {}
      }
    },

    ...mapGetters({
      emailTemplates: 'emailTemplate/list/itemsForSelect'
    }),

    emailTemplate () {
      return this.emailTemplates.filter(template => template['@id'] === this.emailTemplateId).pop()
    }
  },

  watch: {
    args () {
      this.handleUpdateField('arguments', this.args)
    }
  },

  created () {
    this.emailTemplatesLoad()
  },

  beforeDestroy () {
    this.reset()
  },

  methods: {
    ...mapActions({
      emailTemplatesLoad: 'emailTemplate/list/getItems',
      emailTemplatesReset: 'emailTemplate/list/reset'
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
        }
      }).catch((val) => { console.log(val) })
    },

    reset () {
      this.emailTemplatesReset()
    },

    updateArguments (arg, val) {
      Object.assign(this.args, { [arg]: val })
    },

    onSearch (search, loading) {
      loading(true)
      this.search(loading, search, this)
    },

    search: debounce((loading, search, vm) => {
      fetch(`${this.$config.get('entryPoint')}users?lastName=${search}`, { headers: { Authorization: `Bearer ${vm.$store.state.apiKey}` } })
        .then((res) => {
          res.json().then((json) => { vm.searchedUsers = json['hydra:member'] })
          loading(false)
        })
    }, 350)
  }
}
</script>

<style>
  .dropdown.v-select .dropdown-menu {
    visibility: visible;
    opacity: 1;
    top: 100% !important;
    transform: translateY(0px);
  }
</style>
