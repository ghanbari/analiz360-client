<template>
  <d-container
    fluid
    class="main-content-container px-4"
  >
    <div class="page-header d-xs-block d-sm-none mt-3">
      <img
        class="d-block mx-auto"
        style="display: block; width: 150px;"
        src="@/assets/images/logo/logo_md.png"
      >
      <div class="text-center mtr-1">LET DATA TALK</div>
    </div>

    <b-row>
      <b-col
        lg="7"
        md="10"
        class="mx-auto mb-5 pt-3 pt-sm-5"
      >
        <b-card-group>
          <b-card
            no-body
            lg="4"
            class="p-4"
            style="border-radius: 0px"
          >
            <b-card-body>
              <router-view />
            </b-card-body>
          </b-card>
          <b-card
            no-body
            lg="3"
            class="py-4 d-none d-sm-block"
          >
            <div class="mx-auto my-auto">
              <img
                class="d-block mx-auto"
                style="width: 192px;"
                src="@/assets/images/logo/logo_md.png"
              >
              <div class="text-center mtr-1">LET DATA TALK</div>
              <router-view class="mt-5" name="helper" />
            </div>
          </b-card>
        </b-card-group>
      </b-col>
    </b-row>
  </d-container>
</template>

<script>
export default {
  name: 'AuthLayout'
}
</script>


<style lang="scss">
  .mtr-1 {
    margin-top: -1rem;
  }

  body {
    background-color: #E2E2E2 !important;
  }
</style>
