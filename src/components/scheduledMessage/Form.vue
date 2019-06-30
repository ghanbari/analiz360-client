<template>
  <form @submit.prevent="submit(item)">
    <b-form-group
      v-if="$remoteConfig"
      :horizontal="true"
      :label-cols="1"
      label="نوع پیام"
      label-for="scheduledMessage_messageType"
    >
      <b-form-select
        id="scheduledMessage_messageType"
        v-model="item.messageType"
        v-validate="'required'"
        name="messageType"
        data-vv-as="نوع پیام"
        :class="['form-control', isInvalid('messageType') ? 'is-invalid' : '']"
        :options="$remoteConfig.get('scheduleMessage.types', [])"
        :plain="true"
      />
      <div
        v-if="isInvalid('messageType')"
        class="invalid-feedback"
      >
        {{ violations.messageType }}
      </div>
      <div
        v-if="veeErrors.first('messageType')"
        class="invalid-feedback"
      >
        {{ errors.first('messageType') }}
      </div>
    </b-form-group>

    <template v-if="item.messageType === 'email'">
      <b-form-group
        :horizontal="true"
        :label-cols="1"
        label="قالب ایمیل"
        label-for="scheduledMessage_template"
      >
        <b-form-select
          id="scheduledMessage_template"
          key="email-template"
          v-model="item.template"
          v-validate="'required'"
          name="template"
          data-vv-as="قالب ایمیل"
          :class="['form-control', isInvalid('template') ? 'is-invalid' : '']"
          :options="emailTemplates"
          :plain="true"
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
              v-model="item.arguments[parameter]"
              style="margin-bottom: 16px"
              type="text"
              :placeholder="parameter"
            />
          </b-col>
        </b-row>
        <div
          v-if="isInvalid('arguments')"
          class="invalid-feedback"
        >
          {{ violations.arguments }}
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
          v-model="item.senderEmail"
          :class="['form-control', isInvalid('senderEmail') ? 'is-invalid' : '']"
          placeholder="فرستنده ایمیل"
        >
        <div
          v-if="isInvalid('senderEmail')"
          class="invalid-feedback"
        >
          {{ violations.senderEmail }}
        </div>
      </b-form-group>
    </template>
    <template v-else>
      <b-form-group
        :horizontal="true"
        :label-cols="1"
        label="متن پیام"
        label-for="scheduledMessage_message"
      >
        <b-input-group>
          <textarea
            id="scheduledMessage_message"
            ref="message"
            key="sms-message"
            v-model="item.message"
            v-validate="'required|max:500'"
            name="message"
            data-vv-as="متن پیامک"
            :class="['form-control', isInvalid('message') ? 'is-invalid' : '']"
            type="text"
            placeholder="متن پیامک را وارد نمایید."
            rows="3"
            maxlength="500"
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
        label="ارسال کننده"
        label-for="sms_provider"
      >
        <b-form-select
          id="sms_provider"
          v-model="item.provider"
          :class="['form-control', isInvalid('provider') ? 'is-invalid' : '']"
          :options="providers"
          :plain="true"
        />
        <div
          v-if="isInvalid('provider')"
          class="invalid-feedback"
        >
          {{ violations.provider }}
        </div>
      </b-form-group>

      <b-form-group
        :horizontal="true"
        :label-cols="1"
        label="حداکثر تلاش"
        label-for="scheduledMessage_maxTryCount"
      >
        <input
          id="scheduledMessage_maxTryCount"
          key="sms-maxTryCount"
          v-model.number="item.maxTryCount"
          v-validate="'min_value:1'"
          name="maxTryCount"
          data-vv-as="حداکثر تلاش"
          :class="['form-control', isInvalid('maxTryCount') ? 'is-invalid' : '']"
          type="number"
          min="1"
          :required="true"
          placeholder="حداکثر دفعات ارسال مجدد پیام در صورت عدم تحویل پیامک"
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
        label-for="scheduledMessage_timeout"
      >
        <input
          id="scheduledMessage_timeout"
          key="sms-timeout"
          v-model.number="item.timeout"
          v-validate="'min_value:1'"
          name="timeout"
          data-vv-as="وقفه"
          :class="['form-control', isInvalid('timeout') ? 'is-invalid' : '']"
          type="number"
          min="0"
          :required="true"
          placeholder="زمان انتظار برای تحویل پیامک قبل از ارسال مجدد آن"
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
    </template>

    <b-form-group
      :horizontal="true"
      :label-cols="1"
      label="الویت"
      label-for="scheduledMessage_priority"
    >
      <input
        id="scheduledMessage_priority"
        v-model.number="item.priority"
        :class="['form-control', isInvalid('priority') ? 'is-invalid' : '']"
        type="number"
        min="0"
        :required="true"
        placeholder="الویت بیشتر باعث ارسال زودتر پیامک می شود"
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
      label="نوع تاریخ"
      label-for="scheduledMessage_dateType"
    >
      <b-form-select
        id="scheduledMessage_dateType"
        v-model="item.dateType"
        v-validate="'required'"
        name="dateType"
        data-vv-as="نوع تاریخ"
        :class="['form-control', isInvalid('dateType') ? 'is-invalid' : '']"
        :options="[{text: 'نوع تاریخ را انتخاب نمایید', value: '', disabled: true}, {text: 'ثابت', value: 1},{text: 'تکرارشونده', value: 2},{text: 'تولد', value: 3},{text: 'ثبت نام', value: 4}]"
        :plain="true"
      />
      <div
        v-if="isInvalid('dateType')"
        class="invalid-feedback"
      >
        {{ violations.dateType }}
      </div>
      <div
        v-if="veeErrors.first('dateType')"
        class="invalid-feedback"
      >
        {{ errors.first('dateType') }}
      </div>
    </b-form-group>

    <b-form-group
      v-if="item.dateType"
      :horizontal="true"
      :label-cols="1"
      label="تاریخ"
      label-for="scheduledMessage_dates"
    >
      <template v-if="item.dateType === 1">
        <div
          v-for="(date, index) in item.dates.datetimes"
          :key="index"
          class="input-group mb-2"
        >
          <date-picker
            :key="'datetimes-'+index"
            v-model="item.dates.datetimes[index]"
            v-validate="'required'"
            :name="'datetimes-'+index"
            data-vv-as="تاریخ"
            :input-class="(isInvalid('dates') || errors.first('datetimes-'+index)) ? 'is-invalid form-control' : 'form-control'"
            display-format="dddd jDD jMMMM jYYYY HH:mm:ss"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="تاریخ ارسال پیام را انتخاب نمایید"
          />
          <div class="input-group-prepend">
            <b-button
              variant="outline-danger"
              @click="item.dates.datetimes.splice(index, 1)"
            >
              <span class="fa fa-remove" />
            </b-button>
          </div>
        </div>
        <b-button
          variant="outline-success"
          @click="item.dates.datetimes.push('')"
        >
          <span class="fa fa-plus" />
        </b-button>
      </template>

      <template v-if="item.dateType === 2">
        <b-form-select
          key="repeatType"
          v-model="repeatType"
          v-validate="'required'"
          name="repeatType"
          data-vv-as="نوع تکرار"
          :input-class="(isInvalid('dates') || errors.first('repeatType')) ? 'is-invalid form-control' : 'form-control'"
          :options="[{text: 'تکرار به صورت؟', value: ''}, {text: 'هفتگی', value: 1}, {text: 'ماهیانه', value: 2}, {text: 'روزانه', value: 3}]"
          :plain="true"
          style="margin-bottom: 15px"
        />
        <div
          v-if="veeErrors.first('repeatType')"
          class="invalid-feedback"
        >
          {{ errors.first('repeatType') }}
        </div>

        <b-form-checkbox-group
          v-if="repeatType === 1"
          id="basicCheckboxes"
          :class="(isInvalid('dates') || errors.first('weekday')) ? 'is-invalid form-control' : 'form-control'"
          :checked="item.dates.weekday"
          style="margin-bottom: 15px"
        >
          <b-form-checkbox
            key="weekday-saturday"
            v-model="item.dates.weekday"
            v-validate="'required'"
            data-vv-as="روز هفته"
            name="weekday"
            value="saturday"
          >
            شنبه
          </b-form-checkbox>
          <b-form-checkbox
            key="weekday-sunday"
            v-model="item.dates.weekday"
            v-validate="'required'"
            data-vv-as="روز هفته"
            name="weekday"
            value="sunday"
          >
            یک شنبه
          </b-form-checkbox>
          <b-form-checkbox
            key="weekday-monday"
            v-model="item.dates.weekday"
            v-validate="'required'"
            data-vv-as="روز هفته"
            name="weekday"
            value="monday"
          >
            دوشنبه
          </b-form-checkbox>
          <b-form-checkbox
            key="weekday-tuesday"
            v-model="item.dates.weekday"
            v-validate="'required'"
            data-vv-as="روز هفته"
            name="weekday"
            value="tuesday"
          >
            سه شنبه
          </b-form-checkbox>
          <b-form-checkbox
            key="weekday-wednesday"
            v-model="item.dates.weekday"
            v-validate="'required'"
            data-vv-as="روز هفته"
            name="weekday"
            value="wednesday"
          >
            چهارشنبه
          </b-form-checkbox>
          <b-form-checkbox
            key="weekday-thursday"
            v-model="item.dates.weekday"
            v-validate="'required'"
            data-vv-as="روز هفته"
            name="weekday"
            value="thursday"
          >
            پنج شنبه
          </b-form-checkbox>
          <b-form-checkbox
            key="weekday-friday"
            v-model="item.dates.weekday"
            v-validate="'required'"
            data-vv-as="روز هفته"
            name="weekday"
            value="friday"
          >
            جمعه
          </b-form-checkbox>
        </b-form-checkbox-group>

        <v-select
          v-if="repeatType === 2"
          key="monthday"
          v-model="item.dates.monthday"
          v-validate="'required'"
          name="dates"
          data-vv-as="روز ماه"
          :options="[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]"
          style="margin-bottom: 15px"
          multiple
        />

        <input
          v-if="repeatType === 3"
          key="daily"
          v-model.number="item.dates.daily"
          v-validate="'required'"
          name="daily"
          data-vv-as="تکرار روزانه"
          :class="(isInvalid('dates') || errors.first('daily')) ? 'is-invalid form-control' : 'form-control'"
          type="number"
          min="0"
          style="margin-bottom: 15px"
          placeholder="هر چند روز تکرار شود"
        >

        <date-picker
          key="dates-time"
          v-model="item.dates.time"
          v-validate="'required'"
          name="dates-time"
          data-vv-as="ساعت"
          :input-class="(isInvalid('dates') || errors.first('dates-time')) ? 'is-invalid form-control' : 'form-control'"
          display-format="HH:mm:ss"
          type="time"
          format="HH:mm:ss"
          required
          placeholder="در ساعت"
        />
      </template>

      <template v-if="item.dateType === 3">
        <div
          v-for="(day, index) in item.dates.days"
          :key="index"
          class="input-group mb-2"
        >
          <input
            :key="'birthday-day-'+index"
            v-model="item.dates.days[index].day"
            v-validate="'required'"
            :name="'birthday-day-'+index"
            data-vv-as="روز تولد"
            :class="(isInvalid('dates') || errors.first('birthday-day-'+index)) ? 'is-invalid form-control' : 'form-control'"
            type="number"
            min="0"
          >
          <b-input-group-prepend>
            <b-input-group-text>روز</b-input-group-text>
          </b-input-group-prepend>
          <b-form-select
            :key="'birthday-next-'+index"
            v-model="item.dates.days[index].next"
            v-validate="'required'"
            :name="'birthday-next-'+index"
            data-vv-as="قبل یا بعد تولد"
            :class="(isInvalid('dates') || errors.first('birthday-next-'+index)) ? 'is-invalid form-control' : 'form-control'"
            :options="[{text: 'قبل', value: 0}, {text: 'بعد', value: 1}]"
            :plain="true"
          />
          <date-picker
            :key="'birthday-time-'+index"
            v-model="item.dates.days[index].time"
            v-validate="'required'"
            :name="'birthday-time-'+index"
            data-vv-as="زمان تولد"
            :input-class="(isInvalid('dates') || errors.first('birthday-time-'+index)) ? 'is-invalid form-control' : 'form-control'"
            display-format="HH:mm:ss"
            type="time"
            format="HH:mm:ss"
            :required="true"
            placeholder="در ساعت"
          />
          <div class="input-group-prepend">
            <b-button
              variant="outline-danger"
              @click="item.dates.days.splice(index, 1)"
            >
              <span class="fa fa-remove" />
            </b-button>
          </div>
        </div>
        <b-button
          variant="outline-success"
          @click="item.dates.days.push({day: 0, time: '', next: 0})"
        >
          <span class="fa fa-plus" />
        </b-button>
      </template>

      <template v-if="item.dateType === 4">
        <div
          v-for="(day, index) in item.dates.days"
          :key="index"
          class="input-group mb-2"
        >
          <input
            :key="'register-day-'+index"
            v-model="item.dates.days[index].day"
            v-validate="'required'"
            :name="'register-day-'+index"
            data-vv-as="روز ثبت نام"
            :class="(isInvalid('dates') || errors.first('register-day-'+index)) ? 'is-invalid form-control' : 'form-control'"
            type="number"
            min="0"
            required="true"
          >
          <b-input-group-prepend>
            <b-input-group-text>روز دیگر</b-input-group-text>
          </b-input-group-prepend>
          <date-picker
            :key="'register-time-'+index"
            v-model="item.dates.days[index].time"
            v-validate="'required'"
            :name="'register-time-'+index"
            data-vv-as="زمان ثبت نام"
            :input-class="(isInvalid('dates') || errors.first('register-time-'+index)) ? 'is-invalid form-control' : 'form-control'"
            display-format="HH:mm:ss"
            type="time"
            format="HH:mm:ss"
            :required="true"
            placeholder="در ساعت"
          />
          <div class="input-group-prepend">
            <b-button
              variant="outline-danger"
              @click="item.dates.days.splice(index, 1)"
            >
              <span class="fa fa-remove" />
            </b-button>
          </div>
        </div>
        <b-button
          variant="outline-success"
          @click="item.dates.days.push({day: 0, time: ''})"
        >
          <span class="fa fa-plus" />
        </b-button>
      </template>
      <div
        v-if="isInvalid('dates')"
        class="invalid-feedback"
      >
        {{ violations.dates }}
      </div>
      <div
        v-if="veeErrors.first('dates')"
        class="invalid-feedback"
      >
        {{ errors.first('dates') }}
      </div>
    </b-form-group>

    <template v-if="item.dateType !== 1 && item.dateType !== 0">
      <b-form-group
        :horizontal="true"
        :label-cols="1"
        label="شروغ"
        label-for="scheduledMessage_startAt"
      >
        <date-picker
          id="scheduledMessage_startAt"
          v-model="item.startAt"
          :input-class="isInvalid('startAt') ? 'is-invalid form-control' : 'form-control'"
          display-format="dddd jDD jMMMM jYYYY"
          format="YYYY-MM-DD"
          placeholder="تاریخ شروع الگو را مشخص نمایید"
        />
        <div
          v-if="isInvalid('startAt')"
          class="invalid-feedback"
        >
          {{ violations.startAt }}
        </div>
      </b-form-group>

      <b-form-group
        :horizontal="true"
        :label-cols="1"
        label="انقضا"
        label-for="scheduledMessage_expireAt"
      >
        <date-picker
          id="scheduledMessage_expireAt"
          v-model="item.expireAt"
          :input-class="isInvalid('expireAt') ? 'is-invalid form-control' : 'form-control'"
          display-format="dddd jDD jMMMM jYYYY"
          format="YYYY-MM-DD"
          placeholder="تاریخ انقضا الگو را مشخص نمایید"
        />
        <div
          v-if="isInvalid('expireAt')"
          class="invalid-feedback"
        >
          {{ violations.expireAt }}
        </div>
      </b-form-group>

      <b-form-group
        :horizontal="true"
        :label-cols="1"
        label="حداکثر استفاده"
        label-for="scheduledMessage_maxUsageCount"
      >
        <input
          id="scheduledMessage_maxUsageCount"
          v-model.number="item.maxUsageCount"
          v-validate="'required|numeric|min_value:1'"
          name="maxUsageCount"
          data-vv-as="حداکثر استفاده"
          :class="['form-control', isInvalid('maxUsageCount') ? 'is-invalid' : '']"
          type="number"
          placeholder="حداکثر دفعاتی که این الگو استفاده خواهد شد"
          :required="true"
        >
        <div
          v-if="isInvalid('maxUsageCount')"
          class="invalid-feedback"
        >
          {{ violations.maxUsageCount }}
        </div>
        <div
          v-if="veeErrors.first('maxUsageCount')"
          class="invalid-feedback"
        >
          {{ errors.first('maxUsageCount') }}
        </div>
      </b-form-group>
    </template>

    <b-form-group
      label-for="expire"
      :label-cols="null"
      :horizontal="true"
    >
      <b-form-checkbox-group
        id="expired"
        stacked
      >
        <div class="custom-control custom-checkbox">
          <input
            id="expired-checkbox"
            v-model="item.expired"
            type="checkbox"
            class="custom-control-input"
          >
          <label
            class="custom-control-label"
            for="expired-checkbox"
          >منقضی شده؟</label>
        </div>
      </b-form-checkbox-group>
    </b-form-group>

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
          v-model="item.users"
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
          :dropdown-classes="'show'"
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

    values: {
      type: Object,
      required: true
    },

    violations: {
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
      providers: [],
      searchedUsers: []
    }
  },

  computed: {
    item () {
      return this.values
    },

    repeatType: {
      get () {
        return this.item.dates.hasOwnProperty('weekday') ? 1
          : this.item.dates.hasOwnProperty('monthday') ? 2
            : this.item.dates.hasOwnProperty('daily') ? 3 : ''
      },

      set (val) {
        if (val === 1) {
          this.item.dates = { weekday: [], time: '' }
        } else if (val === 2) {
          this.item.dates = { monthday: [], time: '' }
        } else if (val === 3) {
          this.item.dates = { daily: null, time: '' }
        }
      }
    },

    ...mapGetters({
      emailTemplates: 'emailTemplate/list/itemsForSelect'
    }),

    emailTemplate () {
      return this.emailTemplates.filter(template => template['@id'] === this.item.template).pop()
    }
  },

  watch: {
    'item.messageType': function (val) {
      if (val === 'sms') {
        this.item.template = null
      }
    },

    'item.template': function () {
      this.item.arguments = {}
    },

    'item.dates': {
      deep: true,
      handler (val) {
        if (this.item.dateType === 1) {
          if (val.datetimes.length === 0) {
            this.item.dates = { datetimes: [''] }
          }
        } else if (this.item.dateType === 2) {
          console.log('date type 2 is not implemented')
        } else if (this.item.dateType === 3) {
          if (val.days.length === 0) {
            this.item.dates = { days: [{ day: 0, next: 0, time: '' }] }
          }
        } else if (this.item.dateType === 4) {
          if (val.days.length === 0) {
            this.item.dates = { days: [{ day: 0, time: '' }] }
          }
        }
      }
    },

    'item.dateType': function (val) {
      if (val === 1) {
        this.item.dates = { datetimes: [''] }
      } else if (val === 2) {
        console.log('date type 2 is not implemented')
      } else if (val === 3) {
        this.item.dates = { days: [{ day: 0, next: 0, time: '' }] }
      } else if (val === 4) {
        this.item.dates = { days: [{ day: 0, time: '' }] }
      }
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

    addPlaceholder (event) {
      const placeholder = event.target.getAttribute('data')
      const textareaElm = this.$refs.message
      const startPos = textareaElm.selectionStart
      const endPos = textareaElm.selectionEnd
      const textBefore = textareaElm.value.substring(0, startPos)
      const textAfter = textareaElm.value.substring(endPos, textareaElm.value.length)

      textareaElm.value = textBefore + placeholder + textAfter
      this.item.message = textBefore + placeholder + textAfter

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

  .danger,
  .danger .dropdown-toggle,
  .danger .selected-tag {
    color: red;
    border-color: red;
  }
</style>
