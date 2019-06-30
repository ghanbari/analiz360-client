<template>
  <d-container
    fluid
    class="main-content-container px-4 py-5"
  >
    <b-row>
      <b-col
        lg="12"
        class="mb-4"
      >
        <b-card :header="'<i class=\'fa fa-align-justify\'></i> قالب ها'">
          <div
            v-if="error"
            class="alert alert-danger"
          >
            {{ error }}
          </div>
          <b-table
            :fields="fields"
            :hover="true"
            :striped="false"
            :bordered="false"
            :small="false"
            :fixed="false"
            responsive="sm"
            :items="items"
          >
            <template
              slot="edit"
              slot-scope="data"
            >
              <router-link :to="{name: 'EmailTemplateUpdate', params: { id: data.item['@id'] }}">
                <span
                  class="fa fa-pencil"
                  aria-hidden="true"
                />
                <span class="sr-only">ویرایش</span>
              </router-link>
            </template>
          </b-table>
        </b-card>
      </b-col>
    </b-row>
  </d-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      fields: [
        { key: 'id', label: 'شناسه' },
        { key: 'name', label: 'نام' },
        { key: 'edit', label: 'ویرایش؟' }
      ]
    }
  },

  computed: mapGetters({
    deletedItem: 'emailTemplate/del/deleted',
    error: 'emailTemplate/list/error',
    items: 'emailTemplate/list/items',
    isLoading: 'emailTemplate/list/isLoading'
  }),

  created () {
    this.getPage()
  },

  beforeDestroy () {
    this.reset()
  },

  methods: {
    ...mapActions({
      getPage: 'emailTemplate/list/getItems',
      pageReset: 'emailTemplate/list/reset'
    }),

    reset () {
      this.pageReset()
    }
  }
}
</script>
