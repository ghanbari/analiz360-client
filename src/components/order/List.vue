<template>
  <div>
    <h1>Order List</h1>

    <div
      v-if="isLoading"
      class="alert alert-info"
    >
      Loading...
    </div>
    <div
      v-if="deletedItem"
      class="alert alert-success"
    >
      {{ deletedItem['@id'] }} deleted.
    </div>
    <div
      v-if="error"
      class="alert alert-danger"
    >
      {{ error }}
    </div>

    <span v-if="view">
      <button
        :disabled="!view['hydra:previous']"
        type="button"
        class="btn btn-basic btn-sm"
        @click="getPage(view['hydra:first'])"
      >First</button>
      &nbsp;
      <button
        :disabled="!view['hydra:previous']"
        type="button"
        class="btn btn-basic btn-sm"
        @click="getPage(view['hydra:previous'])"
      >Previous</button>
      &nbsp;
      <button
        :disabled="!view['hydra:next']"
        type="button"
        class="btn btn-basic btn-sm"
        @click="getPage(view['hydra:next'])"
      >Next</button>
      &nbsp;
      <button
        :disabled="!view['hydra:last']"
        type="button"
        class="btn btn-basic btn-sm"
        @click="getPage(view['hydra:last'])"
      >Last</button>
      &nbsp;
    </span>

    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>Id</th>
            <th>user</th>
            <th>product</th>
            <th>info</th>
            <th>voucher</th>
            <th colspan="2" />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in items"
            :key="item['@id']"
          >
            <td>
              <router-link
                v-if="item"
                :to="{name: 'OrderShow', params: { id: item['@id'] }}"
              >
                {{ item['@id'] }}
              </router-link>
            </td>
            <td>
              <router-link
                v-if="item"
                :to="{name: 'OrderShow', params: { id: item['@id'] }}"
              >
                {{ item['user'] }}
              </router-link>
            </td>
            <td>
              <router-link
                v-if="item"
                :to="{name: 'OrderShow', params: { id: item['@id'] }}"
              >
                {{ item['product'] }}
              </router-link>
            </td>
            <td>
              <router-link
                v-if="item"
                :to="{name: 'OrderShow', params: { id: item['@id'] }}"
              >
                {{ item['info'] }}
              </router-link>
            </td>
            <td>
              <router-link
                v-if="item"
                :to="{name: 'OrderShow', params: { id: item['@id'] }}"
              >
                {{ item['voucher'] }}
              </router-link>
            </td>
            <td>
              <router-link
                :to="{name: 'OrderShow', params: { id: item['@id'] }}"
              >
                <span
                  class="fa fa-search"
                  aria-hidden="true"
                />
                <span class="sr-only">Show</span>
              </router-link>
            </td>
            <td>
              <router-link :to="{name: 'OrderUpdate', params: { id: item['@id'] }}">
                <span
                  class="fa fa-pencil"
                  aria-hidden="true"
                />
                <span class="sr-only">Edit</span>
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <router-link
      :to="{ name: 'OrderCreate' }"
      class="btn btn-primary"
    >
      Create
    </router-link>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  computed: mapGetters({
    deletedItem: 'order/del/deleted',
    error: 'order/list/error',
    items: 'order/list/items',
    isLoading: 'order/list/isLoading',
    view: 'order/list/view'
  }),

  created () {
    this.getPage()
  },

  methods: mapActions({
    getPage: 'order/list/default'
  })
}
</script>
