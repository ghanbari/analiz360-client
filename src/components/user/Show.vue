<template>
  <b-container v-if="user">
    <b-row>
      <b-col md="12">
        <b-card>
          <b-row>
            <b-col
              md="3"
              class="text-center"
            >
              <div class="mb-2">
                <span
                  style="font-size: 40px; width: 100%"
                  class="icon-user"
                  :class="[user.status === 1 ? 'text-info' : 'text-secondary']"
                />
              </div>
              <div><span>{{ user.status === 1 ? 'فعال' : 'غیرفعال' }}</span></div>
              <div><span class="text-secondary">وضعیت مشتری</span></div>
            </b-col>
            <b-col
              md="3"
              class="text-center"
            >
              <div class="mb-2">
                <span
                  style="font-size: 40px; width: 100%"
                  class="fa fa-clock-o text-danger"
                />
              </div>
              <div>
                <span v-if="userStatistics && userStatistics.lastPurchaseAt">{{ (new Date(userStatistics.lastPurchaseAt)).toLocaleDateString('fa-IR') }}</span>
                <span v-if="!userStatistics || !userStatistics.lastPurchaseAt">خریدی انجام نشده است</span>
              </div>
              <div><span class="text-secondary">اخرین خرید مشتری</span></div>
            </b-col>
            <b-col
              md="3"
              class="text-center"
            >
              <div class="mb-2">
                <span
                  style="font-size: 40px; width: 100%; color: orange"
                  class="fa fa-shopping-cart"
                />
              </div>
              <div><span v-if="userStatistics">{{ (new Intl.NumberFormat('fa-IR')).format(userStatistics.purchaseCount) }}</span></div>
              <div><span class="text-secondary">تعداد خرید مشتری</span></div>
            </b-col>
            <b-col
              md="3"
              class="text-center"
            >
              <router-link :to="{name: 'UserSalesReportList', params: {id: user['id']}}">
                <div class="mb-2">
                  <span
                    style="font-size: 40px; width: 100%"
                    class="fa fa-money text-success"
                  />
                </div>
                <div><span v-if="userStatistics">{{ (new Intl.NumberFormat('fa-IR')).format(userStatistics.purchaseTotal) }}</span></div>
                <div><span class="text-secondary">حجم خرید مشتری</span></div>
              </router-link>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="12">
        <b-card class="user-info">
          <b-tabs>
            <b-tab
              no-body
              title="Picture 1"
            >
              <template slot="title">
                <span class="icon-user" /> <span> اطلاعات اصلی</span>
              </template>
              <b-row>
                <b-col md="4">
                  <b-row>
                    <b-col
                      md="6"
                      class="text-bold"
                    >
                      نام:
                    </b-col>
                    <b-col md="6">
                      {{ user.firstName }}
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col
                      md="6"
                      class="text-bold"
                    >
                      نام خانوادگی:
                    </b-col>
                    <b-col md="6">
                      {{ user.lastName }}
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col
                      md="6"
                      class="text-bold"
                    >
                      جنسیت:
                    </b-col>
                    <b-col md="6">
                      {{ user.sex === 'm' ? 'مرد' : user.sex === 'f' ? 'زن' : '' }}
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col
                      md="6"
                      class="text-bold"
                    >
                      تولد:
                    </b-col>
                    <b-col md="6">
                      {{ (new Date(user.birthday)).toLocaleDateString('fa-IR') }}
                    </b-col>
                  </b-row>
                </b-col>
                <b-col md="4">
                  <b-row>
                    <b-col
                      md="6"
                      class="text-bold"
                    >
                      کد ملی:
                    </b-col>
                    <b-col md="6">
                      {{ user.nationalNumber }}
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col
                      md="6"
                      class="text-bold"
                    >
                      نام کاربری:
                    </b-col>
                    <b-col md="6">
                      {{ user.username }}
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col
                      md="6"
                      class="text-bold"
                    >
                      وضعیت حساب:
                    </b-col>
                    <b-col md="6">
                      {{ user.status === 1 ? 'فعال' : 'غیرفعال' }}
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col
                      md="6"
                      class="text-bold"
                    >
                      تاریخ ثبت نام:
                    </b-col>
                    <b-col md="6">
                      {{ (new Date(user.createdAt)).toLocaleDateString('fa-IR') }}
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </b-tab>

            <b-tab
              no-body
              title="Picture 1"
            >
              <template slot="title">
                <span class="icon-phone" /> <span>تماس</span>
              </template>
              <b-row>
                <b-col md="4">
                  <b-row>
                    <b-col
                      md="6"
                      class="text-bold"
                    >
                      همراه:
                    </b-col>
                    <b-col md="6">
                      {{ user.phone }}
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col
                      md="6"
                      class="text-bold"
                    >
                      تلفن ثابت:
                    </b-col>
                    <b-col md="6">
                      {{ user.telephone }}
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col
                      md="6"
                      class="text-bold"
                    >
                      ایمیل:
                    </b-col>
                    <b-col md="6">
                      {{ user.email }}
                    </b-col>
                  </b-row>
                </b-col>
                <b-col md="4">
                  <b-row>
                    <b-col
                      md="6"
                      class="text-bold"
                    >
                      کد پستی:
                    </b-col>
                    <b-col md="6">
                      {{ user.zipCode }}
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col
                      md="6"
                      class="text-bold"
                    >
                      آدرس:
                    </b-col>
                    <b-col md="6">
                      {{ user.address }}
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </b-tab>
          </b-tabs>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  computed: mapGetters({
    userError: 'user/show/error',
    userLoading: 'user/show/isLoading',
    user: 'user/show/retrieved',
    userStatistics: 'statistics/user/retrieved',
    city: 'city/show/retrieved'
  }),

  watch: {
    user (val) {
      if (val) {
        this.userStatisticsLoad(this.user.id)
      }
    }
  },

  beforeDestroy () {
    this.reset()
  },

  created () {
    this.userLoad(decodeURIComponent(this.$route.params.id))
  },

  methods: {
    ...mapActions({
      userReset: 'user/show/reset',
      userLoad: 'user/show/retrieve',
      userStatisticsLoad: 'statistics/user/retrieve',
      userStatisticsReset: 'statistics/user/reset',
      cityLoad: 'city/show/retrieve',
      cityReset: 'city/show/reset'
    }),

    reset () {
      this.userReset()
      this.userStatisticsReset()
    }
  }
}
</script>

<style>
  .user-info .tab-content{
    border: none;
    border-top: 1px solid #c8ced3;
  }
  .user-info .nav-tabs .nav-item.show .nav-link, .nav-tabs .nav-link.active {
    background-color: transparent;
    border: transparent;
    border-bottom: 3px solid deeppink !important;
    font-size: 16px;
    font-weight: bold;
    color: #5c6063;
  }
  .user-info .nav-link {
    border: 1px solid transparent;
    border-top-left-radius: .25rem;
    border-top-right-radius: .25rem;
    color: #9da3a8;
    font-size: 16px;
    font-weight: 600;
  }
  .user-info .nav-link:hover {
    border: none;
  }
  .user-info thead{
    background: #f3f3f3;
    color: #333;
  }
  .user-info a{
    text-decoration: none;
    color: #333;
    font-weight: 600;
  }
</style>
