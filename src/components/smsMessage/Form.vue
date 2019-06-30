<template>
  <form @submit.prevent="submit(item)">
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

    <b-form-group
      label="متن"
      label-for="message_content"
      :label-cols="1"
      :horizontal="true"
    >
      <b-input-group>
        <textarea
          id="message_content"
          ref="message"
          v-validate="'required|max:500'"
          name="message"
          data-vv-as="متن پیامک"
          :class="['form-control', isInvalid('message') ? 'is-invalid' : '']"
          placeholder="لطفا متن پیامک خود را وارد نمایید"
          rows="3"
          maxlength="500"
          :value="item.message"
          @input="handleUpdateField('message', $event.target.value)"
        />

        <b-input-group-append>
          <b-button-group
            vertical
            size="sm"
          >
            <b-button
              data="{username}"
              @click="addPlaceholder"
            >
              نام کاربری
            </b-button>
            <b-button
              data="{lastName}"
              @click="addPlaceholder"
            >
              نام خانوادگی
            </b-button>
            <b-button
              data="{sex}"
              @click="addPlaceholder"
            >
              جنسیت
            </b-button>
            <b-button
              data="{email}"
              @click="addPlaceholder"
            >
              ایمیل
            </b-button>
            <b-button
              data="{phone}"
              @click="addPlaceholder"
            >
              تلفن
            </b-button>
            <b-button
              data="{city}"
              @click="addPlaceholder"
            >
              شهر
            </b-button>
            <b-button
              data="{firstName}"
              @click="addPlaceholder"
            >
              نام
            </b-button>
          </b-button-group>
        </b-input-group-append>
      </b-input-group>

      <div
        v-if="isInvalid('message')"
        class="invalid-feedback"
      >
        {{ violations.message }}
      </div>
      <div
        v-if="veeErrors.first('message')"
        class="invalid-feedback"
      >
        {{ errors.first('message') }}
      </div>
    </b-form-group>

    <b-form-group
      :horizontal="true"
      :label-cols="1"
      label="حداکثر تلاش"
      label-for="message_maxTryCount"
    >
      <input
        id="message_maxTryCount"
        v-validate="'min_value:1'"
        name="maxTryCount"
        data-vv-as="حداکثر تلاش"
        :class="['form-control', isInvalid('maxTryCount') ? 'is-invalid' : '']"
        placeholder="حداکثر دفعات ارسال مجدد پیام در صورت عدم تحویل پیامک"
        type="number"
        :value="item.maxTryCount"
        @input="handleUpdateField('maxTryCount', parseInt($event.target.value))"
      >
      <div
        v-if="isInvalid('maxTryCount')"
        class="invalid-feedback"
      >
        {{ violations.maxTryCount }}
      </div>
      <div
        v-if="veeErrors.first('maxTryCount')"
        class="invalid-feedback"
      >
        {{ errors.first('maxTryCount') }}
      </div>
    </b-form-group>

    <b-form-group
      :horizontal="true"
      :label-cols="1"
      label="وقفه"
      label-for="message_timeout"
    >
      <input
        id="message_timeout"
        v-validate="'min_value:1'"
        name="timeout"
        data-vv-as="وقفه"
        :class="['form-control', isInvalid('timeout') ? 'is-invalid' : '']"
        placeholder="زمان انتظار برای تحویل پیامک قبل از ارسال مجدد آن"
        type="number"
        :value="item.timeout"
        @input="handleUpdateField('timeout', parseInt($event.target.value))"
      >
      <div
        v-if="isInvalid('timeout')"
        class="invalid-feedback"
      >
        {{ violations.timeout }}
      </div>
      <div
        v-if="veeErrors.first('timeout')"
        class="invalid-feedback"
      >
        {{ errors.first('timeout') }}
      </div>
    </b-form-group>

    <b-form-group
      :horizontal="true"
      :label-cols="1"
      label="الویت"
      label-for="message_priority"
    >
      <input
        id="message_priority"
        :class="['form-control', isInvalid('priority') ? 'is-invalid' : '']"
        placeholder="الویت بیشتر باعث ارسال زودتر پیامک می شود"
        type="number"
        :value="item.priority"
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
      label="ارسال کننده"
      label-for="sms_provider"
    >
      <b-form-select
        id="sms_provider"
        :class="['form-control', isInvalid('provider') ? 'is-invalid' : '']"
        :options="providers"
        :plain="true"
        :value="item.provider"
        @change="handleUpdateField('provider', $event)"
      />
      <div
        v-if="isInvalid('provider')"
        class="invalid-feedback"
      >
        {{ violations.provider }}
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
              شماره تلفن های خود را وارد نمایید
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
          v-validate="'required|numeric|max:11|min:11'"
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
      ارسال
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
      searchedUsers: [],
      providers: []
    }
  },

  computed: {
    // eslint-disable-next-line
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
    },

    addPlaceholder (event) {
      const placeholder = event.target.getAttribute('data')
      const textareaElm = this.$refs.message
      const startPos = textareaElm.selectionStart
      const endPos = textareaElm.selectionEnd
      const textBefore = textareaElm.value.substring(0, startPos)
      const textAfter = textareaElm.value.substring(endPos, textareaElm.value.length)

      textareaElm.value = textBefore + placeholder + textAfter
      this.handleUpdateField('message', textBefore + placeholder + textAfter)

      textareaElm.selectionStart = startPos + placeholder.length
      textareaElm.selectionEnd = endPos + placeholder.length
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
